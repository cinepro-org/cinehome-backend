import Fastify from "fastify";
import "dotenv/config";
import { filterOptionsSchema } from "./types/filterOptions.js";

const PORT = Number(process.env.PORT) || 3000;

const fastify = Fastify({
  logger: false,
});

fastify.post("/movie/:id", (request, reply) => {
  const { id } = request.params as { id: string };
  const body = request.body;
  if (body && !filterOptionsSchema.safeParse(body).success) {
    reply.status(400).send({ error: "Invalid filter options" });
    return;
  }
  const options = body ? filterOptionsSchema.parse(body) : null;
  reply.status(200).send({ message: `Movie ${id} processed`, options });
});

fastify.get("/health", (request, reply) => {
  reply.status(200);
  reply.send({ status: "OK" });
});

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
