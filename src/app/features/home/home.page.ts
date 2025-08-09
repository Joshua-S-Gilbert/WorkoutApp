import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { WorkoutStore } from 'src/app/core/workout.store';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule]
})
export class HomePage implements OnInit {
  private store = inject(WorkoutStore);
  private toast = inject(ToastController);

  exerciseId = signal<string>('');
  reps = signal<number>(10);
  weight = signal<number>(20);

  exercises = this.store.exercises;
  today = this.store.today;

  async addSet(){
    if (!this.exerciseId()) return;
    this.store.upsertTodaySet({
      exerciseId:this.exerciseId(),
      reps:this.reps(),
      weight: this.weight(),
    });
    const t = await this.toast.create({ message: 'Set Logged', duration: 900});
    await t.present();
  }

  seedIfEmpty(){
    if (this.exercises().length === 0){
      this.store.addExercise({name: 'Bench Press', group:'Chest'});
      this.store.addExercise({name: 'Barbell Squat', group:'Legs'});
      this.store.addExercise({name: 'Lat Pulldown', group:'Back'});
    }
  }

  ngOnInit() {
  }

}
