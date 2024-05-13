import { CheckIn, Prisma } from '@prisma/client'

export interface CheckinsRepository {
  create(checkIn: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
  findByUserIdAndDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  findById(checkInId: string): Promise<CheckIn | null>
}
