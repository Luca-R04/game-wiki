/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game-wiki-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css'],
})
export class GameAddComponent implements OnInit {
  constructor(private gameService: GameService, private formBuilder: FormBuilder,) {}

  createForm = this.formBuilder.group({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    releaseDate: ''
  });

  onSubmit(): void {
    console.log(this.createForm.value)

    this.gameService.addGame(this.createForm.value);
  }

  ngOnInit(): void {}
}
