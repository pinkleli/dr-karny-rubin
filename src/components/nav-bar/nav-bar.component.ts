import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Input() scope: string = '';
  public items = [
    {
      title: 'דף הבית',
      link: '',
      scope: 'home'
    },
    {
      title: 'אודותיי',
      link: 'אודותיי',
      scope: 'about'
    },
    {
      title: 'מאמרים',
      link: 'מאמרים',
      scope: 'publications'
    },
  ];

  public messageMe(): void {
    window.open('https://wa.me/972503242021')
  }
}
