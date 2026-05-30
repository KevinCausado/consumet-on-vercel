import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/', (_, rp) => { rp.status(200).send({ intro: 'Mangasee123 provider temporarily unavailable.', routes: [] }); });
};
export default routes;
