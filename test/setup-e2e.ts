import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const schemaId = randomUUID()

function generateUniqueDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)

  return url.toString()
}

beforeAll(async () => {
  process.env.DATABASE_URL = generateUniqueDatabaseUrl()
  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  const prisma = new PrismaClient()
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`)
  await prisma.$disconnect()
})
