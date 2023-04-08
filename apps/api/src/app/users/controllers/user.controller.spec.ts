import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersRepository } from '../repositories/users.repository';
import { GamesRepository } from '../../games/repositories/games.repository';

describe('Users/Controller', () => {
  let app: TestingModule;
  let userController: UsersController;
  let gameService: GamesRepository;
  let userService: UsersRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: GamesRepository,
          useValue: {},
        },
      ],
    }).compile();

    userController = app.get<UsersController>(UsersController);
    userService = app.get<UsersRepository>(UsersRepository);
    gameService = app.get<GamesRepository>(GamesRepository);
  });

  describe('get User', () => {
    const testUser = {
      _id: '6403591c74c74d9f14ad180d',
      name: 'Luca Test',
      email: 'Test@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2004'),
    };

    it('should call findById on the service', async () => {
      const findById = jest
        .spyOn(userService, 'findById')
        .mockImplementation(async () => testUser);

      const results = await userController.findById(testUser._id);

      expect(findById).toBeCalledTimes(1);
      expect(results._id).toEqual(testUser._id);
      expect(results.name).toEqual(testUser.name);
    });
  });
});
