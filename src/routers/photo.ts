import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "node:path";

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
    });
  
    if (!photo) {
      res.json({ error: `No file with id: ${id}` });
      return;
    }
    
    const captions = await prisma.captionsOnPhotos.findMany({
        where: { photo: photo }
    })

    res.json({
        ...photo,
        captions
    })
})

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

export default photoRouter;
