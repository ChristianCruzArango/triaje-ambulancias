import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sala',
    loadComponent: () =>
      import('./features/control-room/components/control-room').then(
        (m) => m.ControlRoom,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'sala' },
  { path: '**', redirectTo: 'sala' },
];
