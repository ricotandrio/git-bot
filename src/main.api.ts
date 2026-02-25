import { config } from "@/infrastructure/config";
import { startServer } from "@/interfaces/api/client";

async function main() {
  await startServer(config.EXPRESS.PORT);
}

main();