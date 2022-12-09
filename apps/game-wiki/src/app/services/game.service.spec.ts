import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import { Game } from '../../../../../shared/game';
import { HttpClient } from '@angular/common/http';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClient],
    });
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should contain game', () => {
    const game = {
      name: 'God of war',
      price: 60,
      category: 'Adventure',
      releaseDate: new Date('2022-09-11'),
      image:
        'https://cdn.europosters.eu/image/750/julisteet/playstation-god-of-war-i116582.jpg',
      positivePercent: 90,
      description:
        "God of War is an action-adventure, hack and slash, mythology-based video game series, originally created by David Jaffe at Sony's Santa Monica Studio.",
    };

    service.addGame(game);

    const result = service.getGames();
    result.subscribe((result) => {
      expect(result.at(11)?.name).toEqual('God of War');
    });
  });

  // it('should be updated', () => {
  //   const game = {
  //     id: 11,
  //     name: 'nieuwe titel',
  //     price: 60,
  //     category: 'Adventure',
  //     releaseDate: new Date('2022-09-11'),
  //     image:
  //       'https://cdn.europosters.eu/image/750/julisteet/playstation-god-of-war-i116582.jpg',
  //     positivePercent: 90,
  //     description:
  //       "God of War is an action-adventure, hack and slash, mythology-based video game series, originally created by David Jaffe at Sony's Santa Monica Studio.",
  //   };

  //   service.editGame(game, game.id);
  //   const result = service.getGames();
  //   result.subscribe((result) => {
  //     expect(result.at(11)?.name).toEqual('nieuwe titel');
  //   });
  // });

  // it('should be deleted', () => {
  //   const game = {
  //     id: 11,
  //     name: 'nieuwe titel',
  //     price: 60,
  //     category: 'Adventure',
  //     releaseDate: new Date('2022-09-11'),
  //     image:
  //       'https://cdn.europosters.eu/image/750/julisteet/playstation-god-of-war-i116582.jpg',
  //     positivePercent: 90,
  //     description:
  //       "God of War is an action-adventure, hack and slash, mythology-based video game series, originally created by David Jaffe at Sony's Santa Monica Studio.",
  //   };

  //   service.deleteGame(game._id);
  //   const result = service.getGames();
  //   result.subscribe((result) => {
  //     expect(result.at(11)?.name).toBeFalsy();
  //   });
  // });
});
