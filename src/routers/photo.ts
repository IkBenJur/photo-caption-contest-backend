import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "node:path";

const photoRouter = express.Router();
const prisma = new PrismaClient();

photoRouter.get("/:id", async (req: Request, res: Response) => {
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
