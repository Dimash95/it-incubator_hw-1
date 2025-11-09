import { HttpResponses } from "./const";
import { Request, Response } from "express";
import { VideoType } from "./types";

export const VideoResolutions = [
  "P144",
  "P240",
  "P360",
  "P480",
  "P720",
  "P1080",
  "P1440",
  "P2160",
] as const;

export type VideoResolution = (typeof VideoResolutions)[number];

export const validateVideoBody = (body: Partial<VideoType>, res: Response) => {
  const errors: { message: string; field: string }[] = [];

  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
    publicationDate,
  } = body;

  // ---- title ----
  if (typeof title !== "string" || !title?.trim()) {
    errors.push({ field: "title", message: "Title is empty or not string!" });
  } else if (title.length > 40) {
    errors.push({
      field: "title",
      message: "Title length should not exceed 40 characters",
    });
  }

  // ---- author ----
  if (typeof author !== "string" || !author?.trim()) {
    errors.push({ field: "author", message: "Author is empty or not string!" });
  } else if (author.length > 20) {
    errors.push({
      field: "author",
      message: "Author length should not exceed 20 characters",
    });
  }

  // ---- availableResolutions ----
  if (
    !Array.isArray(availableResolutions) ||
    !availableResolutions.every((r) => VideoResolutions.includes(r as any))
  ) {
    errors.push({
      field: "availableResolutions",
      message:
        "Resolution of video must be: P144, P240, P360, P480, P720, P1080, P1440, P2160",
    });
  }

  // ---- canBeDownloaded ----
  if (canBeDownloaded !== undefined && typeof canBeDownloaded !== "boolean") {
    errors.push({
      field: "canBeDownloaded",
      message: "CanBeDownloaded must be boolean",
    });
  }

  // ---- minAgeRestriction ----
  if (
    minAgeRestriction !== undefined &&
    minAgeRestriction !== null &&
    (typeof minAgeRestriction !== "number" ||
      minAgeRestriction < 1 ||
      minAgeRestriction > 18)
  ) {
    errors.push({
      field: "minAgeRestriction",
      message: "minAgeRestriction must be number 1–18 or null",
    });
  }

  // ---- publicationDate ----
  if (
    publicationDate !== undefined &&
    (typeof publicationDate !== "string" || isNaN(Date.parse(publicationDate)))
  ) {
    errors.push({
      field: "publicationDate",
      message: "publicationDate must be valid ISO string date",
    });
  }

  if (errors.length) {
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send({ errorsMessages: errors });
  }

  return null;
};
