import { Test } from '@nestjs/testing';
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { Neo4jModule } from 'nest-neo4j/dist';
import { Game } from 'shared/game';
import { GameSchema } from './games.schema';

describe('Users/Schema/Games', () => {
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let gameModel: Model<Game>;

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
        MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]),
      ],
    }).compile();

    gameModel = app.get<Model<Game>>(getModelToken('Game'));
    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('users').deleteMany({});
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('Games schema', () => {
    const errorObject = {
      object: 'test',
      testing: 'object',
    };

    it('should create a gameModel', async () => {
      const testData = {
        name: 'test game',
        image: 'url',
        gameId: '6403591c74c74d9f14ad180d',
      };

      const model = new gameModel(testData);
      expect(model).toBeDefined();
    });

    it('should require a name', async () => {
      const testData = {
        image: 'url',
        gameId: '6403591c74c74d9f14ad180d',
      };

      try {
        const model = new gameModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Game validation failed: name: Path `name` is required.'
        );
      }
    });

    it('should have a string for name', async () => {
      const testData = {
        name: errorObject,
        image: 'url',
        gameId: '6403591c74c74d9f14ad180d',
      };

      try {
        const model = new gameModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Game validation failed: name: Cast to string failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "name"'
        );
      }
    });

    it('should require an image', async () => {
      const testData = {
        name: 'test game',
        gameId: '6403591c74c74d9f14ad180d',
      };

      try {
        const model = new gameModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Game validation failed: image: Path `image` is required.'
        );
      }
    });

    it('should have a string for image', async () => {
      const testData = {
        name: 'test game',
        image: errorObject,
        gameId: '6403591c74c74d9f14ad180d',
      };

      try {
        const model = new gameModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Game validation failed: image: Cast to string failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "image"'
        );
      }
    });

    it('should require a gameId', async () => {
      const testData = {
        name: 'test game',
        image: 'url',
      };

      try {
        const model = new gameModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Game validation failed: gameId: Path `gameId` is required.'
        );
      }
    });

    it('should have a reference ID for gameId', async () => {
      const testData = {
        name: 'test game',
        image: 'url',
        gameId: errorObject,
      };

      try {
        const model = new gameModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Game validation failed: gameId: Cast to ObjectId failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "gameId" because of "BSONTypeError"'
        );
      }
    });
  });
});
