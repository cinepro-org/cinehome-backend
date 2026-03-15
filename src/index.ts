import Fastify from "fastify";
import "dotenv/config";
import { filterOptionsSchema } from "./types/filterOptions.js";
import { getMovieSource } from "./core/sourceFinder.js";

const PORT = Number(process.env.PORT) || 3000;

const fastify = Fastify({
  logger: false,
});

fastify.post("/movie/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const tmdbId = parseInt(id);
  if (isNaN(tmdbId)) {
    reply.status(400).send({ error: "Invalid movie ID" });
    return;
  }
  const body = request.body;
  if (body && !filterOptionsSchema.safeParse(body).success) {
    reply.status(400).send({ error: "Invalid filter options" });
    return;
  }
  const options = body ? filterOptionsSchema.parse(body) : null;

  const source = await getMovieSource(tmdbId, options);
  reply.status(200).send({ source });
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
