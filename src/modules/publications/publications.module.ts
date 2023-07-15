import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationsComponent } from './publications.component';
import { RouterModule } from '@angular/router';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';

@NgModule({
  declarations: [PublicationsComponent],
  exports: [PublicationsComponent],
  imports: [
    CommonModule,
    NavBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: PublicationsComponent,
      },
    ]),
  ],
})
export class PublicationsModule {}
