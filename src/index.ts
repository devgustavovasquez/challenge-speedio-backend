import "dotenv/config";
import Server from "./server";

const port = process.env.PORT || 3000;

(async (): Promise<void> => {
  const server = new Server(port);
  await server.init();
})();
