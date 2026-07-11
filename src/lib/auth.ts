import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI as string;
const client = new MongoClient(mongoUri);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'supporter',
      },
      credits: {
        type: 'number',
        defaultValue: 0,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              credits: user.role === 'creator' ? 20 : 50,
            },
          };
        },
      },
    },
  },
});
