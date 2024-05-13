import { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

import { CheckinsRepository } from '@/repositories/check-ins-repository'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type ValidateCheckInUseCaseRequest = {
  checkInId: string
}

type ValidateCheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkinsRepository: CheckinsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkinsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const MAX_MINUTES_FROM_CHECK_IN_CREATION = 20

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (
      distanceInMinutesFromCheckInCreation > MAX_MINUTES_FROM_CHECK_IN_CREATION
    ) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkinsRepository.save(checkIn)

    return { checkIn }
  }
}
