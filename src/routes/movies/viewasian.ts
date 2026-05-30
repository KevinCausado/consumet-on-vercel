import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/', (_, rp) => { rp.status(200).send({ intro: 'ViewAsian provider temporarily unavailable.', routes: [] }); });
};
export default routes;
