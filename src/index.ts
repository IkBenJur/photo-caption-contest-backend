import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import photoRouter from "./routers/photo";
import userRouter from "./routers/users";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/photo", photoRouter);
app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
