import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    serverTimestamp,
    increment,
    writeBatch
} from "firebase/firestore";
import { db } from "./firebase";

// Types corresponding to Firestore Schema
export interface TripData {
    id?: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    coverImage: string | null;
    placesCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PlaceData {
    id?: string;
    tripId: string;
    name: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    address: string;
    visitedDate: Date;
    content: {
        text: string;
        media: Array<{
            type: 'photo';
            url: string;
            caption?: string;
            timestamp?: Date;
        }>;
    };
    tags: string[];
    rating?: number;
    color?: string;
    isPublic: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Collections Converters
const tripConverter = {
    toFirestore: (data: TripData) => ({
        title: data.title,
        description: data.description,
        startDate: Timestamp.fromDate(data.startDate),
        endDate: Timestamp.fromDate(data.endDate),
        coverImage: data.coverImage,
        placesCount: data.placesCount,
        createdAt: data.createdAt ? Timestamp.fromDate(data.createdAt) : serverTimestamp(),
        updatedAt: serverTimestamp(),
    }),
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data,
            startDate: data.startDate?.toDate(),
            endDate: data.endDate?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        } as TripData;
    }
};

const placeConverter = {
    toFirestore: (data: PlaceData) => ({
        tripId: data.tripId,
        name: data.name,
        coordinates: data.coordinates,
        address: data.address,
        visitedDate: Timestamp.fromDate(data.visitedDate),
        content: data.content,
        tags: data.tags,
        rating: data.rating,
        color: data.color,
        isPublic: data.isPublic,
        createdAt: data.createdAt ? Timestamp.fromDate(data.createdAt) : serverTimestamp(),
        updatedAt: serverTimestamp(),
    }),
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data,
            visitedDate: data.visitedDate?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        } as PlaceData;
    }
};

// --- Trip Operations ---

export const createTrip = async (userId: string, tripData: Omit<TripData, 'id' | 'createdAt' | 'updatedAt' | 'placesCount'>): Promise<string> => {
    const tripRef = doc(collection(db, `users/${userId}/trips`));
    const newTrip: TripData = {
        id: tripRef.id,
        ...tripData,
        placesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await setDoc(tripRef, newTrip); // Note: using setDoc instead of addDoc to use our converter logic if we applied it to collection, but here we do it manually or via withConverter. 
    // Actually, to use converter we need to wrap collection ref.
    // Simplifying:
    await setDoc(tripRef.withConverter(tripConverter), newTrip);
    return tripRef.id;
};

export const getTrips = async (userId: string): Promise<TripData[]> => {
    const tripsRef = collection(db, `users/${userId}/trips`).withConverter(tripConverter);
    const q = query(tripsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

export const updateTrip = async (userId: string, tripId: string, updates: Partial<TripData>) => {
    const tripRef = doc(db, `users/${userId}/trips/${tripId}`).withConverter(tripConverter);
    // @ts-ignore - updates might be partial, converter expects full object for toFirestore if strict? 
    // updateDoc works with plain objects usually, but withConverter might complicate partial updates.
    // Safe way:
    const { id, ...updateData } = updates;
    // We manually convert dates to Timestamps if present for partial update
    const firestoreUpdates: any = { ...updateData, updatedAt: serverTimestamp() };
    if (updates.startDate) firestoreUpdates.startDate = Timestamp.fromDate(updates.startDate);
    if (updates.endDate) firestoreUpdates.endDate = Timestamp.fromDate(updates.endDate);

    await updateDoc(tripRef, firestoreUpdates);
};

export const deleteTrip = async (userId: string, tripId: string) => {
    // 1. Delete all places
    const placesRef = collection(db, `users/${userId}/trips/${tripId}/places`);
    const placesSnapshot = await getDocs(placesRef);
    const batch = writeBatch(db);
    placesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // 2. Delete trip
    const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
    await deleteDoc(tripRef);
};

// --- Place Operations ---

export const createPlace = async (userId: string, tripId: string, placeData: Omit<PlaceData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const placeRef = doc(collection(db, `users/${userId}/trips/${tripId}/places`));
    const newPlace: PlaceData = {
        id: placeRef.id,
        ...placeData,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await setDoc(placeRef.withConverter(placeConverter), newPlace);

    // Update place count on trip
    const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
    await updateDoc(tripRef, {
        placesCount: increment(1)
    });

    return placeRef.id;
};

export const getPlaces = async (userId: string, tripId: string): Promise<PlaceData[]> => {
    const placesRef = collection(db, `users/${userId}/trips/${tripId}/places`).withConverter(placeConverter);
    const q = query(placesRef, orderBy('visitedDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
};

export const subscribeToPlaces = (userId: string, tripId: string, callback: (places: PlaceData[]) => void) => {
    const placesRef = collection(db, `users/${userId}/trips/${tripId}/places`).withConverter(placeConverter);
    const q = query(placesRef, orderBy('visitedDate', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const places = snapshot.docs.map(doc => doc.data());
        callback(places);
    });
};

export const updatePlace = async (userId: string, tripId: string, placeId: string, updates: Partial<PlaceData>) => {
    const placeRef = doc(db, `users/${userId}/trips/${tripId}/places/${placeId}`);

    const { id, ...updateData } = updates;
    const firestoreUpdates: any = { ...updateData, updatedAt: serverTimestamp() };
    if (updates.visitedDate) firestoreUpdates.visitedDate = Timestamp.fromDate(updates.visitedDate);

    await setDoc(placeRef, firestoreUpdates, { merge: true });
};

export const deletePlace = async (userId: string, tripId: string, placeId: string) => {
    const placeRef = doc(db, `users/${userId}/trips/${tripId}/places/${placeId}`);
    await deleteDoc(placeRef);

    // Decrement place count
    const tripRef = doc(db, `users/${userId}/trips/${tripId}`);
    await updateDoc(tripRef, {
        placesCount: increment(-1)
    });
};
