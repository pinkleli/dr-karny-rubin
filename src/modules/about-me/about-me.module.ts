import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutMeComponent } from './about-me.component';
import { RouterModule } from '@angular/router';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';

@NgModule({
  declarations: [AboutMeComponent],
  exports: [AboutMeComponent],
  imports: [
    CommonModule,
    NavBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutMeComponent,
      },
    ]),
  ],
})
export class AboutMeModule {}
