import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { InvalidCredentialsError } from '@/domain/forum/application/use-cases/errors/invalid-credentials-error'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Public } from '@/infra/auth/public.decorator'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type RequestBody = z.infer<typeof bodySchema>

@Public()
@Controller('/sessions')
export class CreateSessionController {
  constructor(
    private readonly authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(bodySchema))
  async handle(@Body() body: RequestBody) {
    const { email, password } = body
    const result = await this.authenticateStudent.execute({ email, password })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(result.value.message)
        default:
          throw new BadRequestException(result.value.message)
      }
    }

    return result.value
  }
}
