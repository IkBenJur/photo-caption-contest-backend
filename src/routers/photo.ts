import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "node:path";
import { authenticate } from "./users";

const photoRouter = express.Router();
const prisma = new PrismaClient();

photoRouter.get("/", async (req: Request, res: Response) => {
  const photos = await prisma.photo.findMany();

  res.json(photos);
});

photoRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const photo = await prisma.photo.findUnique({
    where: { id: Number(id) },
    include: { captions: true },
  });

  if (!photo) {
    res.json({ error: `No file with id: ${id}` });
    return;
  }

  res.json(photo);
});

photoRouter.get("/file/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const photo = await prisma.photo.findUnique({
    where: { id: Number(id) },
  });

  if (!photo) {
    res.json({ error: `No file with id: ${id}` });
    return;
  }

  res.sendFile(path.join(process.cwd(), photo.imageUrl));
});

photoRouter.post(
  "/caption",
  authenticate,
  async (req: Request, res: Response) => {
    const { caption, userId, photoId } = req.body;

    const captionResult = await prisma.captionsOnPhotos.create({
      data: {
        caption,
        userId,
        photoId,
      },
    });

    if (!captionResult) {
      res.json({ error: "Something went wrong with uploading captions" });
      return;
    }

    res.json(captionResult);
  }
);

export default photoRouter;
