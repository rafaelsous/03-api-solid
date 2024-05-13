import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create new check-in successfully', async () => {
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

    const createCheckInResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(userCoordinates)

    expect(createCheckInResponse.statusCode).toEqual(201)
  })
})
