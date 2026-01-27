import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Dot } from '@/types/database';
import { dotToMarkdown, markdownToDot } from './markdown';

export const exportDots = async (dots: Dot[]) => {
    const zip = new JSZip();
    dots.forEach(dot => {
        // Sanitize filename
        const safePlaceName = (dot.place_name || 'untitled').replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_').slice(0, 50);
        const dateStr = dot.created_at.split('T')[0];
        const filename = `${dateStr}_${safePlaceName}_${dot.id.slice(0, 4)}.md`;
        zip.file(filename, dotToMarkdown(dot));
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'traveldot_notes.zip');
};

export const parseMarkdownFiles = async (files: File[]): Promise<Partial<Dot>[]> => {
    const promises = Array.from(files).map(file => {
        return new Promise<Partial<Dot>>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const dot = markdownToDot(content);
                    resolve(dot);
                } catch (err) {
                    reject(err);
                }
            };
            reader.readAsText(file);
        });
    });

    return Promise.all(promises);
};
