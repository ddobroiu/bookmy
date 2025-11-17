// Ensure environment variables from .env are loaded when Prisma loads this TS config
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

export default {
  schema: "prisma/schema.prisma",
}
