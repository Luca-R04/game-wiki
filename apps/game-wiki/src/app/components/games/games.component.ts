/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game-wiki-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
  games: Game[] = [];

  selectedGame?: Game;

  constructor(private gameservice: GameService) {}

  onSelect(game: Game): void {
    this.selectedGame = game;
  }

  getGames(): void {
    this.gameservice.getGames().subscribe((games) => (this.games = games));
  }

  ngOnInit(): void {
    this.getGames();
  }
}
