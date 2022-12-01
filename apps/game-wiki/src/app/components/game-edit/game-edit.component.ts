/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../../../../../shared/game';

@Component({
  selector: 'game-wiki-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent implements OnInit {
  game: Game | undefined;

  constructor(
    private gameService: GameService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
  }

  editForm = this.formBuilder.group({
    id: Number(this.route.snapshot.paramMap.get('id')),
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    releaseDate: '',
  });

  getGame(): void {
    const gameId = Number(this.route.snapshot.paramMap.get('id'));
    this.gameService.getGame(gameId).subscribe((game) => (this.game = game));
  }

  onSubmit(): void {
    console.log(this.editForm.value);
    const gameId = Number(this.route.snapshot.paramMap.get('id'));
    this.gameService.editGame(this.editForm.value, gameId);
  }

  ngOnInit(): void {
    this.getGame();
  }
}
