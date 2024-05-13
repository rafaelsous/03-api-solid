import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { CheckInUseCase } from './check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberCheckInsError } from './errors/max-number-of-check-ins-error'

let usersRepository: InMemoryUsersRepository
let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase // sut: system under test

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(
      usersRepository,
      checkInsRepository,
      gymsRepository,
    )

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -10.2947506,
      longitude: -48.3090628,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in successfully', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -10.2947506,
      userLongitude: -48.3090628,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2016, 0, 1, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -10.2947506,
      userLongitude: -48.3090628,
    })

    await expect(
      async () =>
        await sut.execute({
          userId: 'user-01',
          gymId: 'gym-01',
          userLatitude: -10.2947506,
          userLongitude: -48.3090628,
        }),
    ).rejects.toBeInstanceOf(MaxNumberCheckInsError)
  })

  it('should be able to check in twice on different days', async () => {
    vi.setSystemTime(new Date(2016, 0, 1, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -10.2947506,
      userLongitude: -48.3090628,
    })

    vi.setSystemTime(new Date(2016, 0, 2, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -10.2947506,
      userLongitude: -48.3090628,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in to a distant gym', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -10.2273954,
        userLongitude: -48.3021105,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
