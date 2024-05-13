import { CheckIn } from '@prisma/client'

import { CheckinsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberCheckInsError } from './errors/max-number-of-check-ins-error'

type CheckInUseCaseRequest = {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private checkinsRepository: CheckinsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // const user = await this.usersRepository.findById(userId)

    // if (!user) {
    //   throw new ResourceNotFoundError()
    // }

    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1 // 100 meters

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkinsRepository.findByUserIdAndDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberCheckInsError()
    }

    const checkIn = await this.checkinsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return { checkIn }
  }
}
