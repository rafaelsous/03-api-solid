import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchGymsUseCase } from '@/use-cases/factories/make-fetch-gyms-use-case'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const fetchGymsParamsSchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = fetchGymsParamsSchema.parse(request.query)

  const fetchGymsUseCase = makeFetchGymsUseCase()

  const { gyms } = await fetchGymsUseCase.execute({ query, page })

  return reply.status(200).send({ gyms })
}
