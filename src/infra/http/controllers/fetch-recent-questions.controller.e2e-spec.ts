import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Fetch recent questions (E2E)', () => {
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

  test('[GET] /questions', async () => {
    const { accessToken, user } = await generateAccessToken()
    await prisma.question.createMany({
      data: [
        {
          authorId: user.id,
          title: 'title_1',
          content: 'content_1',
          slug: 'slug_1',
        },
        {
          authorId: user.id,
          title: 'title_2',
          content: 'content_2',
          slug: 'slug_2',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.questions).toHaveLength(2)
  })
})
