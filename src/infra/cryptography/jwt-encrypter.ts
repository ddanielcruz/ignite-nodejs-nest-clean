import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private readonly jwt: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return Promise.resolve(this.jwt.sign(payload))
  }
}
