import express from "express";
import { Request, Response } from "express";
import { VideoType, PostVideoType, PutVideoType } from "./types";
import { VideoResolutions } from "./validation";
import dataJson from "./data.json";
import { HttpResponses } from "./const";

let data: VideoType[] = dataJson;

const makeError = (field: string, message: string) => ({
  errorsMessages: [{ message, field }],
});

const apiRouter = express.Router();

apiRouter.delete("/testing/all-data", (req: Request, res: Response) => {
  data = [];

  return res.sendStatus(HttpResponses.NO_CONTENT);
});

apiRouter.get("/videos/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const video = data.find((v) => v.id === Number(id));

  if (!video)
    return res
      .status(HttpResponses.NOT_FOUND)
      .send(`Video with id ${id} doesn't exist!`);

  return res.status(HttpResponses.OK).send(video);
});

apiRouter.get("/videos", (req: Request, res: Response) => {
  res.status(HttpResponses.OK).send(data);
});

apiRouter.post("/videos", (req: Request, res: Response) => {
  const { title, author, availableResolutions } = req.body as PostVideoType;

  const errors: { message: string; field: string }[] = [];

  if (typeof title !== "string" || !title.trim()) {
    errors.push({ field: "title", message: "Title is empty or not string!" });
  } else if (title.length > 40) {
    errors.push({
      field: "title",
      message: "Title length should not exceed 40 characters",
    });
  }

  if (typeof author !== "string" || !author.trim()) {
    errors.push({ field: "author", message: "Author is empty or not string!" });
  } else if (author.length > 20) {
    errors.push({
      field: "author",
      message: "Author length should not exceed 20 characters",
    });
  }

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

  if (errors.length) {
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send({ errorsMessages: errors });
  }

  const createdAt = new Date();
  const publicationDate = new Date(createdAt);
  publicationDate.setDate(createdAt.getDate() + 1);

  const newVideo = {
    id: data.length,
    title,
    author,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
    availableResolutions,
  };

  data.push(newVideo);
  return res.status(HttpResponses.CREATED).send(newVideo);
});

apiRouter.put("/videos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const video = data.find((v) => v.id === Number(id));

  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
    publicationDate,
  } = req.body as PutVideoType;

  const errors: { message: string; field: string }[] = [];

  if (typeof title !== "string" || !title.trim()) {
    errors.push({ field: "title", message: "Title is empty or not string!" });
  } else if (title.length > 40) {
    errors.push({
      field: "title",
      message: "Title length should not exceed 40 characters",
    });
  }

  if (typeof canBeDownloaded !== "boolean")
    errors.push({
      field: "canBeDownloaded",
      message: "CanBeDownloaded is not boolean!",
    });

  if (typeof author !== "string" || !author.trim()) {
    errors.push({ field: "author", message: "Author is empty or not string!" });
  } else if (author.length > 20) {
    errors.push({
      field: "author",
      message: "Author length should not exceed 20 characters",
    });
  }

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

  if (
    minAgeRestriction !== null &&
    (typeof minAgeRestriction !== "number" ||
      minAgeRestriction < 1 ||
      minAgeRestriction > 18)
  ) {
    errors.push({
      field: "minAgeRestriction",
      message: "minAgeRestriction must be a number between 1 and 18 or null",
    });
  }

  if (errors.length)
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send({ errorsMessages: errors });

  if (!video)
    return res
      .status(HttpResponses.NOT_FOUND)
      .send(`Video with id ${id} doesn't exist!`);

  video.title = title;
  video.author = author;
  video.availableResolutions = availableResolutions;
  video.canBeDownloaded = canBeDownloaded;
  video.minAgeRestriction = minAgeRestriction;
  video.publicationDate = publicationDate;

  return res.sendStatus(HttpResponses.NO_CONTENT);
});

apiRouter.delete("/videos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const videoIndex = data.findIndex((v) => v.id === Number(id));

  if (videoIndex === -1) {
    return res
      .status(HttpResponses.NOT_FOUND)
      .send(`Video with id ${id} doesn't exist!`);
  }

  data.splice(videoIndex, 1);

  return res.sendStatus(HttpResponses.NO_CONTENT);
});

export { apiRouter };
