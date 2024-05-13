import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase // sut: system under test

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get user metrics successfully', async () => {
    for (let i = 1; i <= 22; i++) {
      const numberWithTwoDigits = String(i).padStart(2, '0')

      await checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${numberWithTwoDigits}`,
      })
    }

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })

    expect(checkInsCount).toBe(22)
  })
})
