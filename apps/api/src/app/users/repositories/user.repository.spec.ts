import { Test } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { Neo4jModule } from 'nest-neo4j/dist';
import { UsersRepository } from './users.repository';
import { UserSchema } from '../schemas/users.schema';
import { GamesRepository } from '../../games/repositories/games.repository';
import { GameSchema } from '../../games/schemas/games.schema';
import { User } from 'shared/user';

describe('Users/Repository', () => {
  let repository: UsersRepository;
  let gameRepository: GamesRepository;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;

  let uri: string;
  jest.mock('neo4j-driver/lib/driver');

  beforeAll(async () => {
    const app = await Test.createTestingModule({
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
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]),
      ],
      providers: [UsersRepository, GamesRepository],
    }).compile();

    repository = app.get<UsersRepository>(UsersRepository);
    gameRepository = app.get<GamesRepository>(GamesRepository);

    mongoc = new MongoClient(uri);
    await mongoc.connect();
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

  describe('CRUD Users', () => {
    const testUser: User = {
      name: 'Luca Test',
      email: 'Test@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2004'),
    };

    const updatedUser: User = {
      name: 'Luca updated',
      email: 'TestUpdate@gmail.com',
      password: 'newPassword',
      birthday: new Date('11-10-2003'),
    };

    it('should create a user', async () => {
      const ThisUser = await repository.createUser(testUser);

      expect(ThisUser).toBeDefined();
      expect(ThisUser).toHaveProperty('_id');
      expect(ThisUser).toMatchObject(testUser);
    });

    it('should find a user by email', async () => {
      await repository.createUser(testUser);
      const result = await repository.findUser(testUser.email);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('_id');
      expect(result).toMatchObject(testUser);
    });

    it('should update a user', async () => {
      const ThisUser = await repository.createUser(testUser);
      const result = await repository.updateUser(ThisUser, updatedUser);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('_id');
      expect(result).toMatchObject(updatedUser);
    });

    it('should delete a user', async () => {
      const ThisUser = await repository.createUser(testUser);
      await repository.deleteUser(ThisUser._id);

      const result = await repository.findById(ThisUser._id);

      expect(result).toBeNull();
    });
  });

  describe('Users Friends', () => {
    const testUser: User = {
      name: 'Luca Test',
      email: 'Test@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2004'),
    };

    const friendUser: User = {
      name: 'Luca updated',
      email: 'TestUpdate@gmail.com',
      password: 'newPassword',
      birthday: new Date('11-10-2003'),
    };

    it('should add a friend', async () => {
      const ThisUser = await repository.createUser(testUser);
      const thisFriend = await repository.createUser(friendUser);

      const result = await repository.addFriend(ThisUser.email, thisFriend);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('_id');
      expect(result.friends[0].name).toEqual('Luca updated');
    });

    it('should remove a friend', async () => {
      const ThisUser = await repository.createUser(testUser);
      const thisFriend = await repository.createUser(friendUser);

      await repository.addFriend(ThisUser.email, thisFriend);

      const result = await repository.removeFriend(
        ThisUser.email,
        thisFriend._id
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('_id');
      expect(result.friends[0]).toBeUndefined();
    });
  });

  describe('Users Games CRUD', () => {
    const testUser: User = {
      name: 'Luca Test',
      email: 'Test@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2004'),
    };

    const testUser2: User = {
      name: 'Luca Test2',
      email: 'Test2@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2004'),
    };

    const testGame = {
      name: 'Test Game',
      price: 80,
      category: 'Action',
      releaseDate: new Date('12-12-2004'),
      image: 'url',
      description: 'test description',
      positivePercent: 66,
      userId: '',
      actors: [],
      reviews: [],
    };

    const updatedGame = {
      name: 'Game Updated',
      image: 'https://cdn.europosters.eu/image/750/julisteet/playstation-god-of-war-i116582.jpg',
    };

    it('should add a Game', async () => {
      const ThisUser = await repository.createUser(testUser);
      testGame.userId = ThisUser._id.toString();

      const ThisGame = await gameRepository.addGame(testGame);
      ThisGame.gameId = ThisGame._id.toString();

      const result = await repository.addGame(ThisUser.email, ThisGame);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('_id');
      expect(result.games[0].name).toEqual('Test Game');
    });

    // it('should update a Game', async () => {
    //   const ThisUser = await repository.createUser(testUser2);
    //   testGame.userId = ThisUser._id.toString();

    //   const ThisGame = await gameRepository.addGame(testGame);
    //   ThisGame.gameId = ThisGame._id.toString();

    //   await repository.addGame(ThisUser.email, ThisGame);
    //   await repository.updateGame(ThisUser.email, ThisGame._id, updatedGame);

    //   const newResult = await repository.findById(ThisUser._id.toString());
    //   expect(newResult).toBeDefined();
    //   expect(newResult.games[0].name).toEqual(updatedGame.name);
    //   expect(newResult.games[0].image).toEqual(updatedGame.image);
    // });

    it('should remove a Game', async () => {
      const ThisUser = await repository.createUser(testUser);
      testGame.userId = ThisUser._id.toString();

      const ThisGame = await gameRepository.addGame(testGame);
      ThisGame.gameId = ThisGame._id.toString();

      await repository.addGame(ThisUser.email, ThisGame);

      const newResult = await repository.removeGame(
        ThisUser.email,
        ThisGame._id.toString()
      );

      expect(newResult).toBeDefined();
      expect(newResult).toHaveProperty('_id');
      expect(newResult.games[0]).toBeUndefined();
    });
  });
});
