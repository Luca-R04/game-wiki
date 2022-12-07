/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
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
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      releaseDate: '',
      actors: this.formBuilder.array([this.newActor()]),
    });
  }

  get actors() {
    return this.form.get('actors') as FormArray;
  }

  newActor(): FormGroup {
    return this.formBuilder.group({
      name: '',
      isMale: '',
      birthDay: '',
    });
  }

  onSubmit(): void {
    const values: Partial<Game> = {
      ...this.form.value,
    };
    console.log(this.form.value);
    this.gameService.addGame(values).subscribe();
    this.router.navigateByUrl('/games');
  }

  addField() {
    this.actors.push(this.newActor());
  }

  removeField() {
    if (!(this.actors.length === 1)) {
      this.actors.removeAt(this.actors.length - 1);
    }
  }

  ngOnInit(): void {}
}
