import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchGymsUseCase } from './fetch-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchGymsUseCase // sut: system under test

describe('Fetch Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchGymsUseCase(gymsRepository)
  })

  it('should be able to fetch gyms successfully', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -10.2947506,
      longitude: -48.3090628,
    })

    await gymsRepository.create({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: -10.2947506,
      longitude: -48.3090628,
    })

    const { gyms } = await sut.execute({ query: 'Gym', page: 1 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym' }),
      expect.objectContaining({ title: 'Typescript Gym' }),
    ])
  })

  it('should be able to fetch paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      const randomGymTitle = String(i).padStart(2, '0')

      await gymsRepository.create({
        title: `Javascript Gym ${randomGymTitle}`,
        description: null,
        phone: null,
        latitude: -10.2947506,
        longitude: -48.3090628,
      })
    }

    const { gyms } = await sut.execute({ query: 'Javascript', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ])
  })
})
