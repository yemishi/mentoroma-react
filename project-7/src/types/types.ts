export interface Post {
  id: string;
  title: string;
  content: string;
  starsCount: number;
}

export interface ApiError {
  error: string;
}
