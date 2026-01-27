export interface Profile {
    id: string;
    username: string | null;
    avatar_url: string | null;
    updated_at: string;
}

export interface Dot {
    id: string;
    user_id: string;
    latitude: number;
    longitude: number;
    place_name: string | null;
    group_name: string | null;
    content: any; // Rich text content (JSON)
    media: {
        type: 'image' | 'video';
        url: string;
    }[];
    is_public: boolean;
    created_at: string;
}

export type DatabaseSchema = {
    profiles: Profile;
    dots: Dot;
};
