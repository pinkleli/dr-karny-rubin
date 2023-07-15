import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { RouterModule } from '@angular/router';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';

@NgModule({
  declarations: [HomePageComponent],
  exports: [HomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePageComponent,
      },
    ]),
    NavBarModule,
  ],
})
export class HomePageModule {}
