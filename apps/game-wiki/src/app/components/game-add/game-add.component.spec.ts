import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAddComponent } from './game-add.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';

describe('GameAddComponent', () => {
  let component: GameAddComponent;
  let fixture: ComponentFixture<GameAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameAddComponent],
      imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
