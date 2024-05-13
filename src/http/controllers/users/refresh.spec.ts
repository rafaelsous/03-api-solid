import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Refresh token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh token successfully', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: '123456',
    })

    const authenticateResponse = await request(app.server)
      .post('/sessions')
      .send({
        email: 'john.doe@email.com',
        password: '123456',
      })

    const cookies = authenticateResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies as string[])
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
