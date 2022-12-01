/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../../../../shared/game';
import { GameService } from '../../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'game-wiki-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css'],
})
export class GameDetailComponent implements OnInit {
  game: Game | undefined;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router
  ) {}

  getGame(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.gameService.getGame(id).subscribe((game) => (this.game = game));
  }

  deleteGame(game: Game) {
    this.gameService.deleteGame(game);
    const navigationDetails: string[] = ['/'];
    this.router.navigate(navigationDetails);
  }

  ngOnInit(): void {
    this.getGame();
  }
}
