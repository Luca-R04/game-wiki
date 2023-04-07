import { Test } from '@nestjs/testing';
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { Neo4jModule } from 'nest-neo4j/dist';
import { Review } from 'shared/review';
import { ReviewSchema } from './reviews.schema';

describe('Users/Schema/Reviews', () => {
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let reviewModel: Model<Review>;

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
        MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
      ],
    }).compile();

    reviewModel = app.get<Model<Review>>(getModelToken('Review'));
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

  describe('Reviews schema', () => {
    const errorObject = {
      object: 'test',
      testing: 'object',
    };

    it('should create a reviewModel', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameName: 'Test Game',
        gameId: '',
        reviewId: '',
      };

      const model = new reviewModel(testData);
      expect(model).toBeDefined();
    });

    it('should require a message', async () => {
      const testData = {
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameName: 'Test Game',
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: message: Path `message` is required.'
        );
      }
    });

    it('should have a string for message', async () => {
      const testData = {
        message: errorObject,
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameName: 'Test Game',
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: message: Cast to string failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "message"'
        );
      }
    });

    it('should require a reviewDate', async () => {
      const testData = {
        message: 'toppie',
        isPositive: true,
        gameName: 'Test Game',
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: reviewDate: Path `reviewDate` is required.'
        );
      }
    });

    it('should have a date for reviewDate', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: '12334559i90w56',
        isPositive: true,
        gameName: 'Test Game',
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: reviewDate: Cast to date failed for value "12334559i90w56" (type string) at path "reviewDate"'
        );
      }
    });

    it('should require an isPositive', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        gameName: 'Test Game',
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: isPositive: Path `isPositive` is required.'
        );
      }
    });

    it('should have a boolean for isPositive', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        isPositive: 'answer',
        gameName: 'Test Game',
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: isPositive: Cast to Boolean failed for value "answer" (type string) at path "isPositive" because of "CastError"'
        );
      }
    });

    it('should require a gameName', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: gameName: Path `gameName` is required.'
        );
      }
    });

    it('should have a string for gameName', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameName: errorObject,
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: gameName: Cast to string failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "gameName"'
        );
      }
    });

    it('should require a gameId', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameName: 'Test Game',
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: gameId: Path `gameId` is required.'
        );
      }
    });

    it('should have a reference ID for gameId', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameName: 'Test Game',
        gameId: errorObject,
        reviewId: '6403591c74c74d9f14ad181d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: gameId: Cast to ObjectId failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "gameId" because of "BSONTypeError"'
        );
      }
    });

    it('should require a reviewId', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameName: 'Test Game',
        gameId: '6403591c74c74d9f14ad180d',
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: reviewId: Path `reviewId` is required.'
        );
      }
    });

    it('should have a reference ID for reviewId', async () => {
      const testData = {
        message: 'toppie',
        reviewDate: new Date('12-12-2022'),
        isPositive: true,
        gameName: 'Test Game',
        gameId: '6403591c74c74d9f14ad180d',
        reviewId: errorObject,
      };

      try {
        const model = new reviewModel(testData);
        await model.validate();
      } catch (error) {
        expect(error.message).toContain(
          'Review validation failed: reviewId: Cast to ObjectId failed for value "{ object: \'test\', testing: \'object\' }" (type Object) at path "reviewId" because of "BSONTypeError"'
        );
      }
    });
  });
});
