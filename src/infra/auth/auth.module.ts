import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { Env } from '@/infra/env'

import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService<Env, true>) => {
        const privateKey = configService.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = configService.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          signOptions: { algorithm: 'RS256' },
        }
      },
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, JwtStrategy],
})
export class AuthModule {}
