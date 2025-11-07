const express = require("express");
import { Request, Response } from "express";
import data from "./data.json";

type PostVideo = {
  title: string;
  author: string;
  availableResolutions: string[];
};

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
  const { title, author, availableResolutions } = req.body;
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
