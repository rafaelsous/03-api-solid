import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-ins History (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get check-ins history successfully', async () => {
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

    const checkInsHistoryResponse = await request(app.server)
      .get('/check-ins/history')
      .query({
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(checkInsHistoryResponse.statusCode).toEqual(200)
    expect(checkInsHistoryResponse.body.checkIns).toHaveLength(1)
    expect(checkInsHistoryResponse.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
      }),
    ])
  })
})
