import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, SubOrSub } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const hianime = new ANIME.Hianime();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the hianime provider: check out the provider's website @ https://hianime.to/",
      routes: ['/search', '/info', '/watch', '/episodes/:id'],
      documentation: 'https://docs.consumet.org/#tag/hianime',
    });
  });

  fastify.get('/search', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.query as { q?: string }).q || '';
    const page = (request.query as { page?: number }).page || 1;

    if (!query) return reply.status(400).send({ message: 'query (q) is required' });

    try {
      const res = await hianime.search(query, page);
      return reply.status(200).send(res);
    } catch (err: any) {
      return reply.status(500).send({ message: err.message || 'Something went wrong' });
    }
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id?: string }).id;

    if (!id) return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await hianime.fetchAnimeInfo(id);
      return reply.status(200).send(res);
    } catch (err: any) {
      return reply.status(404).send({ message: err.message || 'Not found' });
    }
  });

  fastify.get('/watch', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId?: string }).episodeId;
    const server = (request.query as { server?: string }).server as StreamingServers;
    const category = (request.query as { category?: string }).category || 'sub';

    if (!episodeId) return reply.status(400).send({ message: 'episodeId is required' });

    if (server && !Object.values(StreamingServers).includes(server)) {
      return reply.status(400).send({ message: 'Invalid server' });
    }

    try {
      const subOrDub = category.toUpperCase() as SubOrSub;
      const res = await hianime.fetchEpisodeSources(episodeId, server, subOrDub);
      return reply.status(200).send(res);
    } catch (err: any) {
      return reply.status(500).send({ message: err.message || 'Something went wrong' });
    }
  });

  fastify.get('/episodes/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.params as { id: string }).id;

    try {
      const info = await hianime.fetchAnimeInfo(id);
      const episodes = (info as any).episodes || [];
      const totalEpisodes = (info as any).totalEpisodes || episodes.length;
      return reply.status(200).send({ totalEpisodes, episodes });
    } catch (err: any) {
      return reply.status(500).send({ message: err.message || 'Something went wrong' });
    }
  });
};

export default routes;
