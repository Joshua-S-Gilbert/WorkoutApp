import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/history.page').then( m => m.HistoryPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.page').then( m => m.SettingsPage)
  },
];
