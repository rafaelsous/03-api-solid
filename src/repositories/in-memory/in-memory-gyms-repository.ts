import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  #gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.#gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.#gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async searchMany(search: string, page: number) {
    const MAX_ITEMS_PER_PAGE = 20

    return this.#gyms
      .filter((gym) => gym.title.includes(search))
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE)
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.#gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }
}
