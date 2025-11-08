const express = require("express");
// import { apiRouter } from "./router";
import { Request, Response } from "express";

export const app = express();
// const port = 5000;

app.use(express.json());
// app.use("/api", apiRouter);
app.get("/", (req: Request, res: Response) => res.send("API is working ✅"));

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
