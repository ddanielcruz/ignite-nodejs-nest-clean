import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

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
      throw result.value
    }
  }
}
