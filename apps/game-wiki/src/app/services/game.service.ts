/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../models/game';
import { GAMES } from '../models/mock-game';

@Injectable({
  providedIn: 'root'
})

export class GameService {

  getGames(): Observable<Game[]> {
    const games = of(GAMES);
    return games;
  }

  deleteGame(game: Game): void {
    delete GAMES[game.id - 1];
  }

  addGame(game: any): void {
    game.id = GAMES.length + 1;
    GAMES.push(game);
  }

  constructor() { }
}
