import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: unknown): Promise<string> {
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }
}
