import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'
import { compare } from 'bcryptjs'

import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type RequestBody = z.infer<typeof bodySchema>

@Controller('/sessions')
export class CreateSessionController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(bodySchema))
  async handle(@Body() body: RequestBody) {
    const { email, password } = body
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const doesPasswordMatch = await compare(password, user.password)
    if (!doesPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials.')
    }

    const accessToken = this.jwt.sign({}, { subject: user.id })

    return { accessToken }
  }
}
