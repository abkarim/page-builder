export type Block = {
    id: number;
    icon: string;
    name: string;
    tag: string;
    content?: string;
    attributes?: Record<string, string>[];
    include?: number[];
    included?: Block[];
};
