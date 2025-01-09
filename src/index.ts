import express, { Request, Response } from "express";
import photoRouter from "./routers/photo";

const app = express();
const port = process.env.PORT || 3000;

app.use("/photo", photoRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
