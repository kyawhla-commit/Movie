export type MovieType = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  overview: string;
  vote_average?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
};

export type TVShowType = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  overview: string;
  vote_average?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres?: { id: number; name: string }[];
};

export type GenreType = {
  id: number;
  name: string;
};

export type PersonType = {
  id: number;
  name: string;
  character: string;
  profile_path: string;
};

export type ReviewType = {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
};
