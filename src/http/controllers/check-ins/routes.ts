import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/valid-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

import { create } from './create'
import { history } from './history'
import { validate } from './validate'
import { metrics } from './metrics'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
}
