const express = require("express");
import { Request, Response } from "express";
import data from "./data.json";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(data);
});

app.get("/", (req: Request, res: Response) => {
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
