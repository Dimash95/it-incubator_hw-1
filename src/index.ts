const express = require("express");
import { Request, Response } from "express";
import { Video, PostVideo, PutVideo } from "./types";
const data: Video[] = require("./data.json");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  data.forEach((video) => {
    if (video.id === Number(id)) {
      res.send(video);
    }
  });

  res.send("Видео с таким id не существует!");
});

app.get("/", (req: Request, res: Response) => {
  res.send(data);
});

app.post("/", (req: Request, res: Response) => {
  const { title, author, availableResolutions } = req.body as PostVideo;

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

app.put("/:id", (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
