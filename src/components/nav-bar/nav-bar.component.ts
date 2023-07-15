import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  public items = [
    {
      title: 'דף הבית',
      link: '/',
    },
    {
      title: 'אודותי',
      link: '/אודותי',
    },
    {
      title: 'מאמרים',
      link: '/מאמרים',
    },
  ];
}
