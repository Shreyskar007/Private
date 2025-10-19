export interface ScoreHistory {
  score: number;
  date: string;
}

export interface Friend {
  id: number;
  name: string;
  score: number;
  color: string;
  photoUrl: string;
  scoreHistory: ScoreHistory[];
}
