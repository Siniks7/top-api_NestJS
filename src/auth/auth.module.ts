import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { getJWTConfig } from 'src/configs/jwt.config'; // Ошибка импорта
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStratagy } from './strategies/jwt.stratagy';
import { UserModel } from './user.model';

@Module({
	controllers: [AuthController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User'
				}
			}
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig
		}),
		PassportModule
	],
	providers: [AuthService, JwtStratagy]
})
export class AuthModule { }

