import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const bodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type RequestBody = z.infer<typeof bodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(bodySchema, { type: 'body' }))
  async handle(@CurrentUser() user: UserPayload, @Body() body: RequestBody) {
    const { title, content } = body
    await this.createQuestion.execute({
      authorId: user.sub,
      title,
      content,
      attachmentsIds: [],
    })
  }
}
