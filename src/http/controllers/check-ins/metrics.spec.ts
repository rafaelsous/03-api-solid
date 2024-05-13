import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-ins Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user check-ins metrics successfully', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        description: null,
        phone: null,
        latitude: -10.2947506,
        longitude: -48.3090628,
      },
    })

    const userCoordinates = {
      userLatitude: -10.2947506,
      userLongitude: -48.3090628,
    }

    await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(userCoordinates)

    const checkInsMetricsResponse = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(checkInsMetricsResponse.statusCode).toEqual(200)
    expect(checkInsMetricsResponse.body.checkInsCount).toEqual(1)
  })
})
