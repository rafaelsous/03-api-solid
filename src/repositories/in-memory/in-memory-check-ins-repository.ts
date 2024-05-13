import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'

import { CheckinsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckinsRepository {
  #checkIns: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.#checkIns.push(checkIn)

    return checkIn
  }

  async findByUserIdAndDate(userId: string, date: Date) {
    const startOfDate = dayjs(date).startOf('date')
    const endOfDate = dayjs(date).endOf('date')

    const checkIn = this.#checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDay =
        checkInDate.isAfter(startOfDate) && checkInDate.isBefore(endOfDate)

      return checkIn.user_id === userId && isOnSameDay
    })

    return checkIn || null
  }

  async findManyByUserId(userId: string, page: number) {
    const MAX_ITEMS_PER_PAGE = 20

    return this.#checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE)
  }

  async countByUserId(userId: string) {
    return this.#checkIns.filter((checkIn) => checkIn.user_id === userId).length
  }

  async findById(id: string) {
    const checkIn = this.#checkIns.find((checkIn) => checkIn.id === id)

    return checkIn || null
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.#checkIns.findIndex(
      (items) => items.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.#checkIns[checkInIndex] = checkIn
    }

    return checkIn
  }
}
