/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
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
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    this.gameId = String(this.route.snapshot.paramMap.get('id'));

    const editForm = {
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      releaseDate: '',
      actors: this.formBuilder.array([]),
    };

    this.form = this.formBuilder.group(editForm);
  }

  get actors() {
    return this.form.get('actors') as FormArray;
  }

  getGame(): void {
    this.gameService.getGame(this.gameId).subscribe((game) => {
      this.game = game;
      this.insertActors();
    });
  }

  newActor(): FormGroup {
    return this.formBuilder.group({
      name: '',
      isMale: '',
      birthDay: '',
    });
  }

  insertActors(): void {
    this.game?.actors.forEach((element) => {
      this.actors.push(
        this.formBuilder.group({
          name: element.name,
          isMale: element.isMale,
          birthDay: this.datePipe.transform(element.birthDay, 'yyyy-MM-dd'),
        })
      );
    });
  }

  addField() {
    this.actors.push(this.newActor());
  }

  removeField() {
    if (!(this.actors.length === 1)) {
      this.actors.removeAt(this.actors.length - 1);
    }
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
