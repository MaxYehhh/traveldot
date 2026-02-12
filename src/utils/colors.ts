export const PLACE_COLORS = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Yellow', value: '#EAB308' },
] as const;

export type PlaceColor = typeof PLACE_COLORS[number]['value'];

export const DEFAULT_PLACE_COLOR = PLACE_COLORS[0].value;
