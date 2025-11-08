const express = require("express");
import { apiRouter } from "./router";

export const app = express();
const port = 5000;

app.use(express.json());

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
