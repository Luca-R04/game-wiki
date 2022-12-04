/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Game } from 'shared/game';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game-wiki-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css'],
})
export class GameAddComponent implements OnInit {
  form: FormGroup;
  constructor(
    private gameService: GameService,
    private formBuilder: FormBuilder
  ) {
    const createForm = {
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      releaseDate: '',
    };
    this.form = this.formBuilder.group(createForm);
  }

  onSubmit(): void {
    const values: Partial<Game> = {
      ...this.form.value,
    };
    this.gameService.addGame(values).subscribe();
  }

  ngOnInit(): void {}
}
