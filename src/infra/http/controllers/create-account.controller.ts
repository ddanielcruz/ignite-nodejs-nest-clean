import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type RequestBody = z.infer<typeof bodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(bodySchema))
  async handle(@Body() body: RequestBody) {
    const result = await this.registerStudent.execute(body)
    if (result.isLeft()) {
      switch (result.value.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(result.value.message)
        default:
          throw new BadRequestException(result.value.message)
      }
    }
  }
}
