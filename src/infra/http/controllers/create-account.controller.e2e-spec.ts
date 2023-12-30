import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  afterAll(() => app.close())

  test('[POST] /accounts', async () => {
    const email = 'john.doe@example.com'
    const password = '123456'
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email,
      password,
    })

    const user = await prisma.user.findUnique({ where: { email } })

    expect(response.status).toBe(204)
    assert(user)
    expect(user.password).not.toEqual(password)
  })
})
