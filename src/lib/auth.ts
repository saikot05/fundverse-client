import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fundverse';
const client = new MongoClient(mongoUri);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET || 'better_auth_secret_key_1234567890123456',
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
});
