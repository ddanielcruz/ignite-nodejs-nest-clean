import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { CurrentUser } from '@/auth/current-user.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import type { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'

const bodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type RequestBody = z.infer<typeof bodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(bodySchema, { type: 'body' }))
  async handle(@CurrentUser() user: UserPayload, @Body() body: RequestBody) {
    const { title, content } = body
    const slug = this.slugifyTitle(title)

    await this.prisma.question.create({
      data: {
        authorId: user.sub,
        title,
        content,
        slug,
      },
    })
  }

  private slugifyTitle(title: string) {
    return title
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}
