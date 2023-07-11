import { Module } from '@nestjs/common'
import { TasksModule } from './tasks/tasks.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

let mode = process.env.MODE
let envFile=".env"

switch (mode){
  case "test":
    envFile=".env.test"
    break
  default:
    mode = "dev"
    envFile=".env.local"
}
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      envFilePath: [envFile, ".env.local", ".env.test", ".env.prod", ".env"],
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        MODE: Joi.string().valid("dev", "prod", "test").default("dev"),
        PORT: Joi.number().default(1606),
        JWT_SECRET: Joi.string(),
      }),
    }),
    AuthModule,
    TasksModule
  ],
})
export class AppModule {}
