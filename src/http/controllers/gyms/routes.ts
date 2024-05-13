import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/valid-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { fetch } from './fetch'
import { nearby } from './nearby'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)

  app.get('/gyms/search', fetch)
  app.get('/gyms/nearby', nearby)
}
