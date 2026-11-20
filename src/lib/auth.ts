import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

// Reuse ONE MongoDB client for the whole app. Without this, the server
// keeps opening new database connections until Atlas reaches its limit —
// then sign-in starts failing with a 500 error until the site is
// redeployed. One shared client with a small pool avoids that.
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(process.env.MONGODB_URI as string, {
    maxPoolSize: 10,
    maxIdleTimeMS: 60000,
  });
globalForMongo.mongoClient = client;

const db = client.db("fix-mate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      area: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Only "technician" is allowed at signup — anything else becomes "customer".
          // Nobody can sign up as "admin".
          const role = (user as { role?: string }).role;
          return {
            data: {
              ...user,
              role: role === "technician" ? "technician" : "customer",
            },
          };
        },
      },
    },
  },
  plugins: [jwt()],
});
