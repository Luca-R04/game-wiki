import { Test } from '@nestjs/testing';
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { Neo4jModule } from 'nest-neo4j/dist';
import { UserSchema } from '../schemas/users.schema';
import { User } from 'shared/user';

describe('Users/Schema', () => {
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let userModel: Model<User>;

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
      ],
    }).compile();

    userModel = app.get<Model<User>>(getModelToken('User'));
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

  describe('User schema', () => {
    const errorObject = {
      object: 'test',
      testing: 'object',
    };

    it('should create a userModel', async () => {
      const testData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        birthday: new Date('1990-01-01'),
        games: [],
        friends: [],
        reviews: [],
      };

      const model = new userModel(testData);
      expect(model).toBeDefined();
    });

    it('should require a name', async () => {
      const testData = {
        email: 'johndoe@example.com',
        password: 'password123',
        birthday: new Date('1990-01-01'),
        games: [],
        friends: [],
        reviews: [],
      };

      try {
        const model = new userModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'User validation failed: name: Path `name` is required.'
        );
      }
    });

    it('should have a string for name', async () => {
      const testData = {
        name: errorObject,
        email: 'johndoe@example.com',
        password: 'password123',
        birthday: new Date('1990-01-01'),
        games: [],
        friends: [],
        reviews: [],
      };

      try {
        const model = new userModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'User validation failed: name: Cast to string failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "name"'
        );
      }
    });

    it('should require an email', async () => {
      const testData = {
        name: 'John Doe',
        password: 'password123',
        birthday: new Date('1990-01-01'),
        games: [],
        friends: [],
        reviews: [],
      };

      try {
        const model = new userModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'User validation failed: email: Path `email` is required.'
        );
      }
    });

    it('should have a string for email', async () => {
      const testData = {
        name: 'name',
        email: errorObject,
        password: 'password123',
        birthday: new Date('1990-01-01'),
        games: [],
        friends: [],
        reviews: [],
      };

      try {
        const model = new userModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'User validation failed: email: Cast to string failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "email"'
        );
      }
    });

    it('should require a password', async () => {
      const testData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        birthday: new Date('1990-01-01'),
        games: [],
        friends: [],
        reviews: [],
      };

      try {
        const model = new userModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'User validation failed: password: Path `password` is required.'
        );
      }
    });

    it('should have a string for password', async () => {
      const testData = {
        name: 'name',
        email: 'johndoe@example.com',
        password: errorObject,
        birthday: new Date('1990-01-01'),
        games: [],
        friends: [],
        reviews: [],
      };

      try {
        const model = new userModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'User validation failed: password: Cast to string failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "password"'
        );
      }
    });

    it('should require a birthday', async () => {
      const testData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        games: [],
        friends: [],
        reviews: [],
      };

      try {
        const model = new userModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'User validation failed: birthday: Path `birthday` is required.'
        );
      }
    });

    it('should have a date for birthday', async () => {
      const testData = {
        name: 'name',
        email: 'johndoe@example.com',
        password: 'password123',
        birthday: '12334559i90w56',
        games: [],
        friends: [],
        reviews: [],
      };

      try {
        const model = new userModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'User validation failed: birthday: Cast to date failed for value "12334559i90w56" (type string) at path "birthday"'
        );
      }
    });
  });
});
