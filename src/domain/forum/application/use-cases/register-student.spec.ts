import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepo: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepo = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepo, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    assert(result.isRight())
    expect(result.value).toMatchObject({
      student: inMemoryStudentsRepo.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })
    const hashedPassword = await fakeHasher.hash('any_password')

    assert(result.isRight())
    expect(inMemoryStudentsRepo.items[0].password).toBe(hashedPassword)
  })
})
