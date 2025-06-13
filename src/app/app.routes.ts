// src/app/routes.ts
import { Routes } from '@angular/router';
import { AvailabilityComponent } from './availability/availability.component';
import { ExcelUploadComponent } from './excel-upload/excel-upload.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

  // haz una ruta por defecto que redirija a la ruta 'home'
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {

    path: 'home',
    component: HomeComponent,
    title: 'Home',

  },

  {

    path: 'availability',
    component: AvailabilityComponent,
    title: 'Disponibilidad Médica',
  },
  {
    path: 'upload',
    component: ExcelUploadComponent,
    title: 'Subir Excel',
  }

];
