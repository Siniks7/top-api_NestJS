import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types, disconnect } from 'mongoose';
import { AppModule } from 'src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from 'src/review/review.constants';
import * as request from 'supertest';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
	login: 'siniks7@yandex.ru',
	password: '434543'
};


jest.setTimeout(30000);

const testDto: CreateReviewDto = {
	name: 'Тест',
	title: 'Заголовок',
	description: 'Описание тестовое',
	rating: 5,
	typegooseName: 'Тест',
	productId
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleFixture.createNestApplication();
		await app.init();
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const registration = await request(app.getHttpServer())
			.post('/auth/register')
			.send(loginDto);
		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto);
		token = body.access_token;
	});

	it('/review/create (POST) - success', async (done) => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
				done();
			});
	});

	it('/review/create (POST) - fail', async (done) => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send({ ...testDto, rating: 0 })
			.expect(400)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.then(({ body }: request.Response) => {
				done();
			});
	});

	it('/review/byProduct/:productId (GET) - success', async (done) => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
				console.log(body);				
				done();
			});
	});


	it('/review/byProduct/:productId (GET) - fail', async (done) => {
		return request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
				done();
			});
	});

	it('/review/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set('Authorization', 'Bearer ' + token)
			.expect(200);
	});

	it('/review/:id (DELETE) - fail', () => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + token)
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND
			});
	});

	afterAll(() => {
		disconnect();
	});
});