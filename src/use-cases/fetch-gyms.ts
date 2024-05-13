import { Gym } from '@prisma/client'

import { GymsRepository } from '@/repositories/gyms-repository'

type FetchGymsUseCaseRequest = {
  query: string
  page: number
}

type FetchGymsUseCaseResponse = {
  gyms: Gym[]
}

export class FetchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: FetchGymsUseCaseRequest): Promise<FetchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
