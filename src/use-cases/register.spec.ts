import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase // sut: system under test

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register a new user successfully', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should encrypt the user password at the time of registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isCorrectPasswordHash = await compare('123456', user.password_hash)

    expect(isCorrectPasswordHash).toBe(true)
  })

  it('should not be able to register user with duplicated email', async () => {
    const user = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    }

    await sut.execute(user)

    await expect(() => sut.execute(user)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
