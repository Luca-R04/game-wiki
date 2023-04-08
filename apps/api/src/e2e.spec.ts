import request = require('supertest');

import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';
import { Neo4jModule } from 'nest-neo4j/dist';

import { GetUserMiddleware } from './app/middleware/get-user.middleware'
import { AuthModule } from './app/auth/auth.module';
import { UsersModule } from './app/users/users.module';
import { GamesModule } from './app/games/games.module';

let mongod: MongoMemoryServer;
let uri: string;

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'game-wiki',
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        return { uri };
      },
    }),
    AuthModule,
    UsersModule,
    GamesModule,
    RouterModule.register([
      {
        path: 'auth-api',
        module: AuthModule,
      },
      {
        path: 'user-api',
        module: UsersModule,
      },
      {
        path: 'game-api',
        module: GamesModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class TestAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes(
        'game-api',
        'user-api',
        'auth-api',
      )
  }
}
describe('end-to-end tests of data API', () => {
  let app: INestApplication;
  let server;
  let module: TestingModule;
  let mongoc: MongoClient;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    mongoc = new MongoClient(uri);
    await mongoc.connect();

    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('games').deleteMany({});
    await mongoc.db('test').collection('users').deleteMany({});
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('single user', () => {
    let credentials;

    beforeEach(() => {
      credentials = {
        name: 'Luca Test',
        email: 'Test@gmail.com',
        password: 'password',
        birthday: new Date('12-01-2004'),
      };
    });

    it('a user registers, logs in, and has no games', async () => {
      const register = await request(server)
        .post('/auth-api/register')
        .send(credentials);

      expect(register.status).toBe(201);
      expect(register.body).toHaveProperty('_id');

      const login = await request(server)
        .post('/auth-api/login')
        .send(credentials);

      expect(login.status).toBe(201);
      expect(login.body).toHaveProperty('authJwtToken');

      const token = login.body.authJwtToken;

      const games = await request(server)
      .get('/game-api/games')
      .set('Authorization', token)

      expect(games.status).toBe(200);
      expect(games.body).toEqual([]);
    });
  });
});
