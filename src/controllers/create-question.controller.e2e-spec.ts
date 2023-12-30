import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(() => app.close())

  async function generateAccessToken() {
    const timestamp = Date.now()
    const user = await prisma.user.create({
      data: {
        name: `User ${timestamp}`,
        email: `user.${timestamp}@example.com`,
        password: timestamp.toString(),
      },
    })

    const accessToken = jwt.sign({}, { subject: user.id })

    return { accessToken, user: { id: user.id } }
  }

  test('[POST] /questions', async () => {
    const { accessToken } = await generateAccessToken()
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'any_title',
        content: 'any_content',
      })

    const question = await prisma.question.findFirst({
      where: { title: 'any_title' },
    })

    expect(response.status).toBe(204)
    expect(question).toBeTruthy()
  })
})
