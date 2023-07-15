import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../modules/home-page/home-page.module').then(
        (m) => m.HomePageModule,
      ),
  },
  {
    path: 'אודותי',
    loadChildren: () =>
      import('../modules/about-me/about-me.module').then(
        (m) => m.AboutMeModule,
      ),
  },
  {
    path: 'מאמרים',
    loadChildren: () =>
      import('../modules/publications/publications.module').then(
        (m) => m.PublicationsModule,
      ),
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
