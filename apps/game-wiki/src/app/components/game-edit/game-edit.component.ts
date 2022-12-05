/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  form: FormGroup;
  gameId: string;

  constructor(
    private gameService: GameService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.gameId = String(this.route.snapshot.paramMap.get('id'));

    const editForm = {
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      releaseDate: '',
    };

    this.form = this.formBuilder.group(editForm);
  }

  getGame(): void {
    this.gameService
      .getGame(this.gameId)
      .subscribe((game) => (this.game = game));
  }

  onSubmit(): void {
    const changes: Partial<Game> = {
      ...this.form.value,
    };
    console.log(changes);
    this.gameService.editGame(changes, this.gameId).subscribe();
  }

  ngOnInit(): void {
    this.getGame();
  }
}
