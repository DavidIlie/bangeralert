declare global {
   namespace NodeJS {
      interface ProcessEnv {
         DATABASE_URL: string;
         AUTH_SPOTIFY_CLIENT_ID: string;
         AUTH_SPOTIFY_CLIENT_SECRET: string;
         NEXTAUTH_URL: string;
         NEXTAUTH_SECRET: string;
         NEXTAUTH_EXPO_URL: string;
      }
   }
}

export {};
