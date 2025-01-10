import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function generateRandomSessionToken() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 14 days

function fromSessionTokenToSessionId(sessionToken: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
}

export async function createSession(sessionToken: string, userId: number) {
  const sessionId = fromSessionTokenToSessionId(sessionToken);

  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  };

  return await prisma.session.create({ data: session });
}

export async function validateSession(sessionToken: string) {
  const sessionId = fromSessionTokenToSessionId(sessionToken);

  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!result) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  //Delete session if expired
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });

    return { session: null, user: null };
  }

  //Refresh session if 15 days left till expires
  if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS) {
    session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);

    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: session.expiresAt },
    });
  }

  return { session, user };
}

export async function invalidateSession(sessionToken: string) {
  const sessionId = await fromSessionTokenToSessionId(sessionToken);
  await prisma.session.delete({ where: { id: sessionId } });
}
