declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      NODE_ENV: string;

      SERVER_URL: string;
      CLIENT_URL: string;

      DB_PORT: number;
      DB_HOST: number;
      DB_DATABASE: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;

      JWT_SECRET: string;

      AUTO_NUMBERING_CODE: string;
    }
  }
}

export {};
