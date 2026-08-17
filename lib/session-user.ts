import "server-only";

import { auth } from "@/auth";

export async function getSessionUserId() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}
