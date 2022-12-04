/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from '../../../../../shared/game';
import { GAMES } from '../models/mock-game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) {}

  getGames(): Observable<Game[]> {
    return this.http
      .get<Game[]>('/api/games')
      .pipe(map((games) => games.sort()));
  }

  deleteGame(gameId: string) {
    return this.http.delete<Game>(`/api/games/${gameId}`);
  }

  editGame(changes: Partial<Game>, gameId: string): Observable<Game> {
    return this.http.put<Game>(`/api/games/${gameId}`, changes);
  }

  addGame(game: Partial<Game>): Observable<Game> {
    return this.http.post<Game>('/api/games', game);
  }

  getGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`/api/games/${gameId}`);
  }
}
