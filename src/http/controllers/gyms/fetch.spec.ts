import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Fetch Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch gyms successfully', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: null,
        phone: null,
        latitude: -10.2947506,
        longitude: -48.3090628,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: null,
        phone: null,
        latitude: -10.2947506,
        longitude: -48.3090628,
      })

    const fetchGymsResponse = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Javascript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(fetchGymsResponse.statusCode).toEqual(200)
    expect(fetchGymsResponse.body.gyms).toHaveLength(1)
    expect(fetchGymsResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ])
  })
})
