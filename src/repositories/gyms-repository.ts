import { Gym, Prisma } from '@prisma/client'

export type FindManyNearbyParams = {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  create(gym: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  searchMany(search: string, page: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}
