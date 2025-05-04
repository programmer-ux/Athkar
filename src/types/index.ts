// src/types/index.ts

export type Athkar = {
  id: string;
  category: string; // e.g., 'Morning', 'Evening', 'Prayer'
  text: string; // The Athkar text in Arabic
  count: number; // How many times to recite
  reference?: string; // Optional: Source/reference
};
