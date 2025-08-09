import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { WorkoutStore } from '../../core/workout.store';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [IonicModule, CommonModule],
  template: `
  <!-- <ion-header><ion-toolbar><ion-title>Settings</ion-title></ion-toolbar></ion-header>
  <ion-content class="ion-padding">
    <ion-segment [value]="store.units()" (ionChange)="store.setUnits($event.detail.value)">
      <ion-segment-button value="metric">Metric (kg)</ion-segment-button>
      <ion-segment-button value="imperial">Imperial (lb)</ion-segment-button>
    </ion-segment>
  </ion-content> -->
  `
})
export class SettingsPage {
  store = inject(WorkoutStore);
}