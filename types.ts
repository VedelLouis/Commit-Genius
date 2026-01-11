
export enum CommitStyle {
  CONVENTIONAL = 'Conventional Commits',
  GITMOJI = 'Gitmoji',
  MINIMAL = 'Minimalist',
  DETAILED = 'Detailed/Storytelling'
}

export interface CommitHistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  style: CommitStyle;
}

export interface GenerationConfig {
  style: CommitStyle;
  scope?: string;
  includeBody: boolean;
  includeFooter: boolean;
}
