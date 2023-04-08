import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersRepository } from '../repositories/users.repository';
import { GamesRepository } from '../../games/repositories/games.repository';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../constants';
import { BadRequestException } from '@nestjs/common';

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
            addFriend: jest.fn(),
            removeFriend: jest.fn(),
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
      friends: [],
    };

    const friendUser = {
      _id: '6403591c74c74d9f14ad123d',
      name: 'Luca friend',
      email: 'friend@gmail.com',
      password: 'password',
      birthday: new Date('12-12-2001'),
      friends: [
        {
          name: 'Luca Test',
          email: 'Test@gmail.com',
          password: 'password',
          birthday: new Date('12-12-2004'),
        },
      ],
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
      jest
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
      jest
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
      jest
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
      jest.spyOn(userService, 'deleteUser').mockImplementation(async () => ({
        acknowledged: true,
        deletedCount: 1,
      }));

      jest
        .spyOn(gameService, 'deleteFromUser')
        .mockImplementation(async () => ({
          acknowledged: true,
          deletedCount: 1,
        }));

      jest
        .spyOn(userService, 'findUser')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      const result = await userController.deleteUser(token);
      expect(result.acknowledged).toBe(true);
      expect(result.deletedCount).toBe(1);
    });

    it('should fail to deleteUser', async () => {
      jest.spyOn(userService, 'deleteUser');

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      try {
        await userController.deleteUser(token);
      } catch (error) {
        expect(error.message).toContain('Could not find user to delete');
      }
    });

    it('should fail to addFriend duplicate', async () => {
      jest.spyOn(userService, 'addFriend').mockImplementation(async () => {
        throw new BadRequestException('Friend already exists');
      });

      jest
        .spyOn(userService, 'findById')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      try {
        await userController.addFriend(token, friendUser._id);
      } catch (error) {
        expect(error.message).toContain('Friend already exists');
      }
    });

    it('should fail non-existing addFriend', async () => {
      jest.spyOn(userService, 'addFriend').mockImplementation(async () => null);

      jest.spyOn(userService, 'findById').mockImplementation(async () => {
        throw new BadRequestException('user not found');
      });

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      try {
        await userController.addFriend(token, friendUser._id);
      } catch (error) {
        expect(error.message).toContain(
          'Friend or authenticated user does not exist'
        );
      }
    });

    it('should add friend', async () => {
      jest
        .spyOn(userService, 'addFriend')
        .mockImplementation(async () => friendUser);

      jest
        .spyOn(userService, 'findById')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: friendUser.email }, JWT_SECRET);

      const results = await userController.addFriend(token, testUser._id);
      expect(results._id).toEqual(friendUser._id);
      expect(results.friends[0].name).toEqual(testUser.name);
    });

    it('should remove friend', async () => {
      const removeFriend = jest
        .spyOn(userService, 'removeFriend')
        .mockImplementation(async () => testUser);

      const token = jwt.sign({ email: testUser.email }, JWT_SECRET);

      const results = await userController.removeFriend(token, friendUser._id);
      expect(removeFriend).toBeCalledTimes(1);
      expect(results._id).toEqual(testUser._id);
      expect(results.friends[0]).toBeUndefined();
    });
  });
});
