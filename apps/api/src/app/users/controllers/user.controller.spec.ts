import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersRepository } from '../repositories/users.repository';
import { GamesRepository } from '../../games/repositories/games.repository';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../constants';

describe('Users/Controller', () => {
  let app: TestingModule;
  let userController: UsersController;
  let userService: UsersRepository;
  let gameService: GamesRepository;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
            findUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
        {
          provide: GamesRepository,
          useValue: {
            deleteFromUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = app.get<UsersController>(UsersController);
    userService = app.get<UsersRepository>(UsersRepository);
    gameService = app.get<GamesRepository>(GamesRepository);
  });

  describe('User CRUD', () => {
    const testUser = {
      _id: '6403591c74c74d9f14ad180d',
      name: 'Luca Test',
      email: 'Test@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2004'),
    };

    const friendUser = {
      _id: '6403591c74c74d9f14ad123d',
      name: 'Luca friend',
      email: 'friend@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2001'),
    };

    const updatedUserId = {
      _id: '6403591c74c74d9f14ad180d',
      name: 'Luca Updated',
      email: 'Update@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2003'),
    };

    const updatedUserName = {
      name: 'Luca Updated',
      email: 'Update@gmail.com',
      password: 'newPassword',
      birthday: new Date('12-12-2003'),
    };

    const updatedUserPassword = {
      email: 'Update@gmail.com',
      password: '',
      birthday: new Date('12-12-2003'),
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

    it('should call findUser on the service', async () => {
      const findUser = jest
        .spyOn(userService, 'findUser')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      const results = await userController.findUser(token);

      expect(findUser).toBeCalledTimes(1);
      expect(results._id).toEqual(testUser._id);
      expect(results.name).toEqual(testUser.name);
    });

    it('should not update _id on UpdateUser', async () => {
      const updateUser = jest
        .spyOn(userService, 'updateUser')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      try {
        await userController.updateUser(token, updatedUserId);
      } catch (error) {
        expect(error.message).toContain("Can't update userId");
      }
    });

    it('should not update name on UpdateUser', async () => {
      const updateUser = jest
        .spyOn(userService, 'updateUser')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      try {
        await userController.updateUser(token, updatedUserName);
      } catch (error) {
        expect(error.message).toContain("Can't update user name");
      }
    });

    it('should fail password hash on UpdateUser', async () => {
      const updateUser = jest
        .spyOn(userService, 'updateUser')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      try {
        await userController.updateUser(token, updatedUserPassword);
      } catch (error) {
        expect(error.message).toContain('Password hash failed');
      }
    });

    it('should deleteUser', async () => {
      const deleteUser = jest
        .spyOn(userService, 'deleteUser')
        .mockImplementation(async () => ({
          acknowledged: true,
          deletedCount: 1,
        }));

      const deleteGames = jest
        .spyOn(gameService, 'deleteFromUser')
        .mockImplementation(async () => ({
          acknowledged: true,
          deletedCount: 1,
        }));

      const findUser = jest
        .spyOn(userService, 'findUser')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      const result = await userController.deleteUser(token);
      expect(result.acknowledged).toBe(true);
      expect(result.deletedCount).toBe(1);
    });

    it('should fail to deleteUser', async () => {
      const deleteUser = jest.spyOn(userService, 'deleteUser');

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      try {
        await userController.deleteUser(token);
      } catch (error) {
        expect(error.message).toContain('Could not find user to delete');
      }
    });
  });
});
