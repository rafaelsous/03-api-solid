import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'
import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(
    usersRepository,
    checkInsRepository,
    gymsRepository,
  )

  return useCase
}
