
export interface Course {
  name: string;
  code: string;
  credits: number;
  description: string;
}

export interface CLO {
  id: string; // e.g., CLO1
  description: string;
  bloomLevel: string;
  skillType: string;
}

export interface PLO {
  id: string; // e.g., PLO1
  description: string;
}

// Maps CLO id to an array of PLO ids
export type PloMapping = Record<string, string[]>;

export interface Evaluation {
  cloId: string;
  achievement: number; // Percentage
}
