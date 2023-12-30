import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type RequestBody = z.infer<typeof bodySchema>

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
      throw result.value
    }

    return result.value
  }
}
