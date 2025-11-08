export type VideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: string[];
};

export type PostVideoType = {
  title: string;
  author: string;
  availableResolutions: string[];
};

export type PutVideoType = {
  title: string;
  author: string;
  availableResolutions: string[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
