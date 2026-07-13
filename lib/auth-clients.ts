import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  session: {
    keepAlive: {
      interval: 60 * 60,
    },
  },
});

export const { signIn, signUp, useSession } = createAuthClient();
