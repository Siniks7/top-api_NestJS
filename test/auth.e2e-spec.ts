import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { AppModule } from 'src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as request from 'supertest';

const loginDto: AuthDto = {
	login: 'siniks7@yandex.ru',
	password: '434543'
};

jest.setTimeout(30000);

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleFixture.createNestApplication();
		await app.init();
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(loginDto);
	});

	it('/auth/login (POST) - success', async (done) => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				token = body.access_token;
				expect(token).toBeDefined();
				done();
			});
	});

	it('/auth/login (POST) - fail', async (done) => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send({ ...loginDto, password: '231414' })
			.expect(400)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.then(({ body }: request.Response) => {
				done();
			});
	});

	it('/auth/login (POST) - fail №1(Unauthorized)', async (done) => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: '231414' })
			.expect(401)
			.then(({ body }: request.Response) => {
				token = body.access_token;
				expect(token).not.toBeDefined();
				done();
			});
	});

	it('/auth/login (POST) - fail №2(bad request)', async (done) => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ password: '231414' })
			.expect(400)
			.then(({ body }: request.Response) => {
				token = body.access_token;
				expect(token).not.toBeDefined();
				done();
			});
	});

	afterAll(() => {
		disconnect();
	});
});