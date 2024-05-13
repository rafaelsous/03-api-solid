import { CheckIn } from '@prisma/client'

import { CheckinsRepository } from '@/repositories/check-ins-repository'

type FetchUserCheckInsHistoryUseCaseRequest = {
  userId: string
  page: number
}

type FetchUserCheckInsHistoryUseCaseResponse = {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkinsRepository: CheckinsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkinsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
