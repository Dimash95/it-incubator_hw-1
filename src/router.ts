import express from "express";
import { Request, Response } from "express";
import { Video, PostVideo, PutVideo } from "./types";
import { VideoResolutions } from "./validation";
import dataJson from "./data.json";
import { HttpResponses } from "./const";

let data: Video[] = dataJson;
const apiRouter = express.Router();

apiRouter.get("/videos/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const video = data.find((v) => v.id === Number(id));

  res.status(HttpResponses.OK).send(video);

  if (!video)
    res
      .status(HttpResponses.NOT_FOUND)
      .send(`Video with id ${id} doesn't exist!`);
});

apiRouter.get("/videos", (req: Request, res: Response) => {
  res.status(HttpResponses.OK).send(data);
});

apiRouter.post("/videos", (req: Request, res: Response) => {
  const { title, author, availableResolutions } = req.body as PostVideo;

  if (
    !Array.isArray(availableResolutions) ||
    !availableResolutions.every((r) => VideoResolutions.includes(r as any))
  ) {
    res
      .status(HttpResponses.BAD_REQUEST)
      .send(
        "Resolution of video must be: P144, P240, P360, P480, P720, P1080, P1440, P2160"
      );
  }

  const newVideo = {
    id: data.length,
    title,
    author,
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions,
  };

  data.push(newVideo);
  res.status(HttpResponses.CREATED).send(newVideo);
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
  } = req.body as PutVideo;

  if (
    !Array.isArray(availableResolutions) ||
    !availableResolutions.every((r) => VideoResolutions.includes(r as any))
  ) {
    res
      .status(HttpResponses.BAD_REQUEST)
      .send(
        "Resolution of video must be: P144, P240, P360, P480, P720, P1080, P1440, P2160"
      );
  }

  if (!video) {
    res
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

  res.sendStatus(HttpResponses.NO_CONTENT);
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
