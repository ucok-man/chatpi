import { swagger } from "@elysiajs/swagger";

export const createSwagger = (version: string) =>
  swagger({
    documentation: {
      info: {
        title: "Chatpi API Documentation",
        version: version,
      },
    },
  });
