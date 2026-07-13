import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as dbSchema from "@/db/schema"; // Đảm bảo import toàn bộ schema

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: dbSchema, // Bắt buộc phải có để Better-Auth đọc được bảng user mở rộng
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
 
  user: {
    additionalFields: {
      companyName: {
        type: "string", 
      },
      role: {
        type: "string",
      },
      fleetSize: {
        type: "number",
      },
    },
  },
});
