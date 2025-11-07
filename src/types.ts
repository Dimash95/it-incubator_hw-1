export type Video = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: string[];
};

export type PostVideo = {
  title: string;
  author: string;
  availableResolutions: string[];
};

export type PutVideo = {
  title: string;
  author: string;
  availableResolutions: string[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
