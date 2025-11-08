import express, { Request, Response } from "express";
// import { apiRouter } from "./router";
// import serverless from "serverless-http";

const app = express();
const port = 5000;

app.use(express.json());
// app.use("/api", apiRouter);
app.get("/", (req: Request, res: Response) => res.send("API is working ✅"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;

// export const handler = serverless(app);
