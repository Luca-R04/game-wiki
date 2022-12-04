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
  gameId: string;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router
  ) {
    this.gameId = String(this.route.snapshot.paramMap.get('id'));
  }

  getGame(): void {
    this.gameService
      .getGame(this.gameId)
      .subscribe((game) => (this.game = game));
  }

  deleteGame() {
    this.gameService.deleteGame(this.gameId).subscribe();
    const navigationDetails: string[] = ['/'];
    this.router.navigate(navigationDetails);
  }

  ngOnInit(): void {
    this.getGame();
  }
}
