import { Dot } from '@/types/database';

export function dotToMarkdown(dot: Dot): string {
    const frontmatter = [
        '---',
        `id: "${dot.id}"`,
        `place_name: "${dot.place_name || ''}"`,
        `latitude: ${dot.latitude}`,
        `longitude: ${dot.longitude}`,
        `group: "${dot.group_name || ''}"`,
        `created_at: "${dot.created_at}"`,
        `is_public: ${dot.is_public}`,
        '---',
        ''
    ].join('\n');

    const content = typeof dot.content === 'string'
        ? dot.content
        : (dot.content?.text || JSON.stringify(dot.content, null, 2) || '');

    return `${frontmatter}\n${content}`;
}

export function markdownToDot(markdown: string): Partial<Dot> {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
        throw new Error('Invalid Markdown format');
    }

    const [, frontmatter, content] = match;
    const lines = frontmatter.split('\n');
    const metadata: Record<string, any> = {};

    lines.forEach(line => {
        const [key, ...values] = line.split(':');
        if (key && values.length) {
            let value = values.join(':').trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            metadata[key.trim()] = value;
        }
    });

    return {
        id: metadata.id,
        place_name: metadata.place_name,
        latitude: parseFloat(metadata.latitude),
        longitude: parseFloat(metadata.longitude),
        group_name: metadata.group || null,
        created_at: metadata.created_at,
        is_public: metadata.is_public === 'true',
        content: { text: content.trim() }
    };
}
