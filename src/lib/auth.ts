import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { jwt } from 'better-auth/plugins';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dummy';
const client = new MongoClient(mongoUri);
const db = client.db(process.env.MONGODB_DB_NAME || 'fundverse');


export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    modelName: 'users',
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
  session: {
    modelName: 'sessions',
  },
  account: {
    modelName: 'accounts',
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      disableImplicitLinking: false,
      requireLocalEmailVerified: false,
    },
  },
  verification: {
    modelName: 'verifications',
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
  plugins: [
    jwt(),
  ],
});
