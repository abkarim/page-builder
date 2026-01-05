export type Blocks = {
  id: number;
  name: string;
  tag: string;
  content?: string;
  attributes?: [Record<string, string>];
};
