import { CheckinsRepository } from '@/repositories/check-ins-repository'

type GetUserMetricsUseCaseRequest = {
  userId: string
}

type GetUserMetricsUseCaseResponse = {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkinsRepository: CheckinsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkinsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
