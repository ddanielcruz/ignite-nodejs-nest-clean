import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

import { AppModule } from '@/app.module'

describe('Create session (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  afterAll(() => app.close())

  test('[POST] /sessions', async () => {
    const email = 'john.doe@example.com'
    const password = '123456'

    // Create user
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email,
      password,
    })

    // Create session
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password,
    })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ accessToken: expect.any(String) })
  })
})
