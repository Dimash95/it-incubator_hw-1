const express = require("express");
import { Request, Response } from "express";
import { Video, PostVideo, PutVideo } from "./types";
import { VideoResolutions } from "./validation";
let data: Video[] = require("./data.json");

export const apiRouter = express.Router();

apiRouter.get("/videos/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  data.forEach((video) => {
    if (video.id === Number(id)) {
      res.send(video);
    }
  });

  res.send("Видео с таким id не существует!");
});

apiRouter.get("/videos", (req: Request, res: Response) => {
  res.send(data);
});

apiRouter.post("/videos", (req: Request, res: Response) => {
  const { title, author, availableResolutions } = req.body as PostVideo;

  if (
    !Array.isArray(availableResolutions) ||
    !availableResolutions.every((r) => VideoResolutions.includes(r as any))
  ) {
    res
      .status(400)
      .send(
        "Resolution of video must be: P144, P240, P360, P480, P720, P1080, P1440, P2160"
      );
  }

  data.push({
    id: data.length,
    title,
    author,
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions,
  });
  res.send(data);
});

apiRouter.put("/videos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) res.send("Видео с таким id не существует!");

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
      .status(400)
      .send(
        "Resolution of video must be: P144, P240, P360, P480, P720, P1080, P1440, P2160"
      );
  }

  data.forEach((video) => {
    if (video.id === Number(id)) {
      video.title = title;
      video.author = author;
      video.availableResolutions = availableResolutions;
      video.canBeDownloaded = canBeDownloaded;
      video.minAgeRestriction = minAgeRestriction;
      video.publicationDate = publicationDate;
      res.send(video);
    }
  });

  res.send("Видео с таким id не существует!");
});

apiRouter.delete("/videos/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  let result: Video[] = [];

  data.forEach((video) => {
    if (video.id !== Number(id)) {
      result.push(video);
    }
  });

  if (data.length === result.length) {
    res.send(`No video with id ${id}`);
  }

  data = result;

  res.send(`Video ${id} was deleted!`);
});
