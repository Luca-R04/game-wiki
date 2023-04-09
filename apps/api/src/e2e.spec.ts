import request = require('supertest');

import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';

import { GetUserMiddleware } from './app/middleware/get-user.middleware';
import { UsersModule } from './app/users/users.module';
import { GamesModule } from './app/games/games.module';
import { AuthModule } from './app/auth/auth.module';

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
    UsersModule,
    GamesModule,
    AuthModule,
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
      .forRoutes('game-api', 'user-api', 'auth-api');
  }
}
describe('end-to-end tests of API', () => {
  let app: INestApplication;
  let module: TestingModule;
  let mongoc: MongoClient;
  let server;
  let neo4jService: Neo4jService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    neo4jService = app.get<Neo4jService>(Neo4jService);

    mongoc = new MongoClient(uri);
    await mongoc.connect();

    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('games').deleteMany({});
    await mongoc.db('test').collection('users').deleteMany({});
    await neo4jService.write(`MATCH (n)
    OPTIONAL MATCH (n)-[r]-()
    DELETE n, r
    `);
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('User basic usage', () => {
    let credentials;
    let friendCredentials;

    beforeEach(() => {
      credentials = {
        name: 'Luca Test',
        email: 'Test@gmail.com',
        password: 'password',
        birthday: new Date('12-01-2004'),
      };

      friendCredentials = {
        name: 'John Friend',
        email: 'Friend@gmail.com',
        password: 'friendPassword',
        birthday: new Date('11-02-2001'),
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
        .set('Authorization', token);

      expect(games.status).toBe(200);
      expect(games.body).toEqual([]);
    });

    it('a user registers, logs in, creates game, adds friend and gets recommendation', async () => {
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
        .set('authorization', token);

      expect(games.status).toBe(200);
      expect(games.body).toEqual([]);

      const game = {
        name: 'God of war',
        price: 60,
        releaseDate: '2022-09-11T00:00:00.000Z',
        image:
          'https://cdn.europosters.eu/image/750/julisteet/playstation-god-of-war-i116582.jpg',
        positivePercent: 90,
        description:
          "God of War is an action-adventure, hack and slash, mythology-based video game series, originally created by David Jaffe at Sony's Santa Monica Studio.",
        category: 'Adventure',
        actors: [
          {
            name: 'Christopher Judge',
            birthDay: '1990-09-11',
            isMale: true,
          },
          {
            name: 'Jeremy Davies',
            birthDay: '1990-09-11',
            isMale: true,
          },
          {
            name: 'Alastair Duncan',
            birthDay: '1990-09-11',
            isMale: true,
          },
        ],
      };

      const createGame = await request(server)
        .post('/game-api/games')
        .set('authorization', token)
        .send(game);

      expect(createGame.status).toBe(201);
      expect(createGame.body).toHaveProperty('_id');
      expect(createGame.body).toHaveProperty('reviews');
      expect(createGame.body).toHaveProperty('userId');
      expect(createGame.body.name).toEqual(game.name);
      expect(createGame.body.price).toEqual(game.price);
      expect(createGame.body.releaseDate).toEqual(game.releaseDate);
      expect(createGame.body.image).toEqual(game.image);
      expect(createGame.body.positivePercent).toEqual(game.positivePercent);
      expect(createGame.body.description).toEqual(game.description);
      expect(createGame.body.category).toEqual(game.category);
      expect(createGame.body.actors[0].name).toEqual(game.actors[0].name);
      expect(createGame.body.actors[1].name).toEqual(game.actors[1].name);
      expect(createGame.body.actors[2].name).toEqual(game.actors[2].name);

      const friendRegister = await request(server)
        .post('/auth-api/register')
        .send(friendCredentials);

      expect(friendRegister.status).toBe(201);
      expect(friendRegister.body).toHaveProperty('_id');

      const friendLogin = await request(server)
        .post('/auth-api/login')
        .send(friendCredentials);

      expect(friendLogin.status).toBe(201);
      expect(friendLogin.body).toHaveProperty('authJwtToken');

      const friendToken = friendLogin.body.authJwtToken;

      const friendGames = await request(server)
        .get('/game-api/games')
        .set('authorization', friendToken);

      expect(friendGames.status).toBe(200);
      expect(friendGames.body).toHaveLength(1);

      const toReviewGame = await request(server)
        .get(`/game-api/games/${friendGames.body[0]._id}`)
        .set('authorization', friendToken);

      expect(toReviewGame.status).toBe(200);
      expect(toReviewGame.body._id).toEqual(friendGames.body[0]._id);

      const friendReview = {
        message: 'topspel',
        reviewDate: '2023-08-11T00:00:00.000Z',
        isPositive: true,
        userName: friendRegister.body.name,
        userId: friendRegister.body._id,
      };

      const review = await request(server)
        .put(`/game-api/games/review/${friendGames.body[0]._id}`)
        .set('authorization', friendToken)
        .send(friendReview);

      expect(review.status).toBe(200);
      expect(review.body.reviews[0]).toHaveProperty('_id');
      expect(review.body.reviews[0].userId).toEqual(friendReview.userId);

      const errorRecommendation = await request(server)
        .get(`/user-api/user/game/recommended`)
        .set('authorization', token);

      expect(errorRecommendation.status).toBe(400);
      expect(errorRecommendation.body.message).toEqual(
        'User does not have any friends'
      );

      const befriend = await request(server)
        .put(`/user-api/user`)
        .set('authorization', token)
        .send({ friendId: friendRegister.body._id });

      expect(befriend.status).toBe(200);
      expect(befriend.body.friends[0]).toHaveProperty('_id');
      expect(befriend.body.friends[0].name).toEqual('John Friend');

      const recommendation = await request(server)
        .get(`/user-api/user/game/recommended`)
        .set('authorization', token);

      expect(recommendation.status).toBe(200);
      expect(recommendation.body.name).toEqual('God of war');
      expect(recommendation.body.recommendorName).toEqual('John Friend');
    });

    it('a user registers, logs in, creates game, tries to edit other users game', async () => {
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
        .set('authorization', token);

      expect(games.status).toBe(200);
      expect(games.body).toEqual([]);

      const game = {
        name: 'God of war',
        price: 60,
        releaseDate: '2022-09-11T00:00:00.000Z',
        image:
          'https://cdn.europosters.eu/image/750/julisteet/playstation-god-of-war-i116582.jpg',
        positivePercent: 90,
        description:
          "God of War is an action-adventure, hack and slash, mythology-based video game series, originally created by David Jaffe at Sony's Santa Monica Studio.",
        category: 'Adventure',
        actors: [
          {
            name: 'Christopher Judge',
            birthDay: '1990-09-11',
            isMale: true,
          },
          {
            name: 'Jeremy Davies',
            birthDay: '1990-09-11',
            isMale: true,
          },
          {
            name: 'Alastair Duncan',
            birthDay: '1990-09-11',
            isMale: true,
          },
        ],
      };

      const createGame = await request(server)
        .post('/game-api/games')
        .set('authorization', token)
        .send(game);

      expect(createGame.status).toBe(201);
      expect(createGame.body).toHaveProperty('_id');
      expect(createGame.body).toHaveProperty('reviews');
      expect(createGame.body).toHaveProperty('userId');
      expect(createGame.body.name).toEqual(game.name);
      expect(createGame.body.price).toEqual(game.price);
      expect(createGame.body.releaseDate).toEqual(game.releaseDate);
      expect(createGame.body.image).toEqual(game.image);
      expect(createGame.body.positivePercent).toEqual(game.positivePercent);
      expect(createGame.body.description).toEqual(game.description);
      expect(createGame.body.category).toEqual(game.category);
      expect(createGame.body.actors[0].name).toEqual(game.actors[0].name);
      expect(createGame.body.actors[1].name).toEqual(game.actors[1].name);
      expect(createGame.body.actors[2].name).toEqual(game.actors[2].name);

      const friendRegister = await request(server)
        .post('/auth-api/register')
        .send(friendCredentials);

      expect(friendRegister.status).toBe(201);
      expect(friendRegister.body).toHaveProperty('_id');

      const friendLogin = await request(server)
        .post('/auth-api/login')
        .send(friendCredentials);

      expect(friendLogin.status).toBe(201);
      expect(friendLogin.body).toHaveProperty('authJwtToken');

      const friendToken = friendLogin.body.authJwtToken;

      const friendGames = await request(server)
        .get('/game-api/games')
        .set('authorization', friendToken);

      expect(friendGames.status).toBe(200);
      expect(friendGames.body).toHaveLength(1);

      const editGame = await request(server)
        .put(`/game-api/games/${friendGames.body[0]._id}`)
        .set('authorization', friendToken)
        .send(game);

      expect(editGame.status).toBe(401);
      expect(editGame.body.message).toEqual('Can not update other users games');
    });
  });
});
