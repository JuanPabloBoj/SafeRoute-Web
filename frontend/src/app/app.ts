import { Component, inject } from '@angular/core';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private readonly router = inject(Router);

  esRutaAutenticacion(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register');
  }
}