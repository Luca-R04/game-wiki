/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../models/game';
import { GAMES } from '../models/mock-game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  getGames(): Observable<Game[]> {
    const games = of(GAMES);
    return games;
  }

  deleteGame(game: Game): void {
    GAMES.splice(GAMES.indexOf(game), 1);
  }

  addGame(game: any): void {
    game.id = GAMES[GAMES.length - 1].id + 1;
    GAMES.push(game);
  }

  getGame(id: number): Observable<Game> {
    const game = GAMES.find(g => g.id === id)!;
    return of(game);
  }

  constructor() {}
}
