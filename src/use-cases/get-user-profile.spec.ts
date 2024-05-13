import { hashSync } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase // sut: system under test

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to return user profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: hashSync('123456', 6),
    })

    await sut.execute({
      userId: user.id,
    })

    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to return user profile when the user does not exists', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
