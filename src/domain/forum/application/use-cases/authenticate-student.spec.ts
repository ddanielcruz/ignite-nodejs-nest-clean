import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepo: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepo = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepo,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate student', async () => {
    const student = makeStudent({
      password: await fakeHasher.hash('any_password'),
    })
    inMemoryStudentsRepo.items.push(student)

    const result = await sut.execute({
      email: student.email,
      password: 'any_password',
    })

    assert(result.isRight())
    expect(result.value).toMatchObject({ accessToken: expect.any(String) })
  })
})
