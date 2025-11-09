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

  if (!title)
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("title", "Title is empty"));

  if (typeof title !== "string")
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("title", "Title is not string!"));

  if (!author)
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("author", "Author is empty!"));

  if (typeof author !== "string")
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("author", "Author is not string!"));

  if (
    !Array.isArray(availableResolutions) ||
    !availableResolutions.every((r) => VideoResolutions.includes(r as any))
  ) {
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(
        "Resolution of video must be: P144, P240, P360, P480, P720, P1080, P1440, P2160"
      );
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

  if (!title)
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("title", "Title is empty"));

  if (typeof title !== "string")
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("title", "Title is not string!"));

  if (!author)
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("author", "Author is empty!"));

  if (typeof author !== "string")
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("author", "Author is not string!"));

  if (!canBeDownloaded)
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("canBeDownloaded", "CanBeDownloaded is empty!"));

  if (typeof canBeDownloaded !== "boolean")
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(makeError("canBeDownloaded", "CanBeDownloaded is not boolean!"));

  if (
    !Array.isArray(availableResolutions) ||
    !availableResolutions.every((r) => VideoResolutions.includes(r as any))
  ) {
    return res
      .status(HttpResponses.BAD_REQUEST)
      .send(
        "Resolution of video must be: P144, P240, P360, P480, P720, P1080, P1440, P2160"
      );
  }

  if (!video) {
    return res
      .status(HttpResponses.NOT_FOUND)
      .send(`Video with id ${id} doesn't exist!`);
  } else {
    video.title = title;
    video.author = author;
    video.availableResolutions = availableResolutions;
    video.canBeDownloaded = canBeDownloaded;
    video.minAgeRestriction = minAgeRestriction;
    video.publicationDate = publicationDate;
  }

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
