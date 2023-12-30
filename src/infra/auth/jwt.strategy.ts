import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { EnvService } from '../env/env.service'

const tokenSchema = z.object({
  sub: z.string().cuid(),
})

export type UserPayload = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: EnvService) {
    const publicKey = envService.get('JWT_PUBLIC_KEY')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: unknown) {
    return tokenSchema.parse(payload)
  }
}
