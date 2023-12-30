import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { Student } from '../../enterprise/entities/student'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentsRepo: StudentsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepo.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentsRepo.create(student)

    return right({ student })
  }
}
