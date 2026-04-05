import { config } from "@/core/config";
import { startServer } from "@/interfaces/api/client";

async function main() {
  await startServer(config.EXPRESS.PORT);
}

main();