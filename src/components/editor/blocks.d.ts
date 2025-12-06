export type Blocks = {
    id: number;
    name: string;
    element: string;
    default_content?: string;
    available_styles: string[];
    available_edits: string[];
    alternative_tags?: string[];
};
