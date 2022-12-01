/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http"
import { Observable, of } from 'rxjs';
import {map} from "rxjs/operators";;
import { Game } from '../../../../../shared/game';
import { GAMES } from '../models/mock-game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http:HttpClient) {

  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>('/api/games')
    .pipe(
      map(games => games.sort())
    );
  }

  deleteGame(game: Game): void {
    GAMES.splice(GAMES.indexOf(game), 1);
  }

  editGame(game: any, id: number): void {
    const oldGame = GAMES.find(g => g.id === id)!;
    const index = GAMES.indexOf(oldGame);
    GAMES[index] = game;
  }

  addGame(game: any): void {
    game.id = GAMES[GAMES.length - 1].id + 1;
    GAMES.push(game);
  }

  getGame(id: number): Observable<Game> {
    const game = GAMES.find(g => g.id === id)!;
    return of(game);
  }
}
