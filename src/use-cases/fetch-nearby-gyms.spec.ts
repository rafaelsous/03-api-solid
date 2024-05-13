import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase // sut: system under test

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms successfully', async () => {
    const userCoordinates = {
      userLatitude: -10.2947506,
      userLongitude: -48.3090628,
    }

    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -10.2947506,
      longitude: -48.3090628,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -10.1769454,
      longitude: -48.3080049,
    })

    const { gyms } = await sut.execute(userCoordinates)

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
