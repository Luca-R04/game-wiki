import { Test } from '@nestjs/testing';
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { Neo4jModule } from 'nest-neo4j/dist';
import { User } from 'shared/user';
import { FriendSchema } from './friends.schema';

describe('Users/Schema/Friends', () => {
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let friendModel: Model<User>;

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
        MongooseModule.forFeature([{ name: 'Friend', schema: FriendSchema }]),
      ],
    }).compile();

    friendModel = app.get<Model<User>>(getModelToken('Friend'));
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

  describe('Friends schema', () => {
    const errorObject = {
      object: 'test',
      testing: 'object',
    };

    it('should create a friendModel', async () => {
      const testData = {
        name: 'John Doe',
      };

      const model = new friendModel(testData);
      expect(model).toBeDefined();
    });

    it('should require a name', async () => {
      const testData = {};

      try {
        const model = new friendModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Friend validation failed: name: Path `name` is required.'
        );
      }
    });

    it('should have a string for name', async () => {
      const testData = {
        name: errorObject,
      };

      try {
        const model = new friendModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Friend validation failed: name: Cast to string failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "name"'
        );
      }
    });
  });
});
