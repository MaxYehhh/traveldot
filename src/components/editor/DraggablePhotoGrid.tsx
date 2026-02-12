import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Plus } from 'lucide-react';

interface DraggablePhotoGridProps {
    photos: string[];
    onReorder: (newPhotos: string[]) => void;
    onRemove: (index: number) => void;
    onAddClick: () => void;
}

interface SortablePhotoItemProps {
    photo: string;
    index: number;
    onRemove: () => void;
}

function SortablePhotoItem({ photo, index, onRemove }: SortablePhotoItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="w-32 h-32 rounded-xl overflow-hidden relative group flex-shrink-0 cursor-move"
        >
            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
                <X size={12} />
            </button>
        </div>
    );
}

export function DraggablePhotoGrid({ photos, onReorder, onRemove, onAddClick }: DraggablePhotoGridProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = photos.indexOf(active.id as string);
            const newIndex = photos.indexOf(over.id as string);
            onReorder(arrayMove(photos, oldIndex, newIndex));
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={photos} strategy={rectSortingStrategy}>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    <button
                        type="button"
                        onClick={onAddClick}
                        className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-500 hover:text-blue-500 flex-shrink-0 group"
                    >
                        <Plus className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">新增照片</span>
                    </button>
                    {photos.map((photo, index) => (
                        <SortablePhotoItem
                            key={photo}
                            photo={photo}
                            index={index}
                            onRemove={() => onRemove(index)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
