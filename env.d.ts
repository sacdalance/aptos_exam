// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY: string;
      FULL_NAME: string;
      GITHUB: string;
      EMAIL: string;
      DISCORD: string;
    }
  }