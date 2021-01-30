import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {StartScreenComponent} from './start-screen/start-screen.component'

const routes: Routes = [
  { path: "start-screen", component: StartScreenComponent },

  { path: '', redirectTo: '/start-screen', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
