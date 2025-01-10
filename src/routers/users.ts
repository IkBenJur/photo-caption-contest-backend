import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  createSession,
  generateRandomSessionToken,
  invalidateSession,
  validateSession,
} from "../auth/session.js";
import { hashPassword, verifyPassword } from "../auth/password.js";

const userRouter = express.Router();
const prisma = new PrismaClient();

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionToken = req.cookies.session;

  if (typeof sessionToken !== "string") {
    res.json({ error: "Request cookie is invalid." });
    return;
  }

  const { session, user } = await validateSession(sessionToken);
  
  if (!session || !user) {
    res.clearCookie("session");
    res.json({ error: "Your session has expired" });
    return;
  }

  res.cookie("session", sessionToken, {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: session.expiresAt,
  });
  next();
}

userRouter.post("/register", async (req: Request, res: Response) => {
  const { name, password, email } = req.body;

  const user = await prisma.user.create({
    data: {
      name,
      password: await hashPassword(password),
      email,
    },
  });

  const sessionToken = generateRandomSessionToken();
  const session = await createSession(sessionToken, user.id);

  res
    .cookie("session", sessionToken, {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: session.expiresAt,
    })
    .json(user);
});

userRouter.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    res.json({ error: "Incorrect email or password" });
    return;
  }

  const validPassword = await verifyPassword(user.password, password);
  if (!validPassword) {
    res.json({ error: "Incorrect email or password" });
    return;
  }

  const sessionToken = generateRandomSessionToken();
  const session = await createSession(sessionToken, user.id);

  res
    .cookie("session", sessionToken, {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: session.expiresAt,
    })
    .json(user);
});

userRouter.post(
  "/signout",
  authenticate,
  async (req: Request, res: Response) => {
    const sessionToken = req.cookies.session;

    await invalidateSession(sessionToken);
    res.clearCookie("session");

    res.json({ message: "Loged out user" });
  }
);

export default userRouter;
