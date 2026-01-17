export interface Draft {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}
