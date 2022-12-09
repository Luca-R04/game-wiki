/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Game } from '../../../../../../shared/game';
import { GameService } from '../../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Review } from 'shared/review';
import { ReviewService } from '../../services/review.service';
import { UserService } from '../../services/user.service';
import { User } from 'shared/user';

@Component({
  selector: 'game-wiki-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css'],
})
export class GameDetailComponent implements OnInit {
  game: Game | undefined;
  user: User | undefined;
  gameId: string;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private gameService: GameService,
    private userService: UserService,
    private reviewService: ReviewService,
    private router: Router
  ) {
    this.gameId = String(this.route.snapshot.paramMap.get('id'));
    this.form = this.formBuilder.group({
      message: '',
      isPositive: '',
      reviewDate: '',
      userId: '',
      userName: '',
    });
  }

  getGame(): void {
    this.gameService
      .getGame(this.gameId)
      .subscribe((game) => (this.game = game));

    this.gameService.getUser().subscribe((user) => (this.user = user));
  }

  deleteGame() {
    this.gameService.deleteGame(this.gameId).subscribe();
    const navigationDetails: string[] = ['/games'];
    this.router.navigate(navigationDetails);
  }

  submitReview(): void {
    const values: Partial<Review> = {
      ...this.form.value,
    };

    values.userId = this.user?._id;
    values.userName = this.user?.name;
    values.reviewDate = new Date();
    values.gameId = this.game?._id;
    values.gameName = this.game?.name;
    console.log(this.form.value);
    this.reviewService
      .addReview(values, this.gameId)
      .subscribe((game) => (this.game = game));
    this.userService.addReview(values).subscribe();
  }

  addFriend(friendId: string): void {
    this.userService.addFriend(friendId).subscribe();
  }

  ngOnInit(): void {
    this.getGame();
  }
}
