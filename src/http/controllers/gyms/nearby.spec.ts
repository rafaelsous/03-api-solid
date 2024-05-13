import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby gyms successfully', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        description: null,
        phone: null,
        latitude: -10.2947506,
        longitude: -48.3090628,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        description: null,
        phone: null,
        latitude: -10.1769454,
        longitude: -48.3080049,
      })

    const userCoordinates = {
      userLatitude: -10.2947506,
      userLongitude: -48.3090628,
    }

    const nearbyGymsResponse = await request(app.server)
      .get('/gyms/nearby')
      .query(userCoordinates)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(nearbyGymsResponse.statusCode).toEqual(200)
    expect(nearbyGymsResponse.body.gyms).toHaveLength(1)
    expect(nearbyGymsResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
