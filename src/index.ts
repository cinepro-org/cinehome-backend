import Fastify from "fastify";
import "dotenv/config";

const PORT = Number(process.env.PORT) || 3000;

const fastify = Fastify({
  logger: false,
});

fastify.post("/movie/:id", (request, reply) => {});

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
