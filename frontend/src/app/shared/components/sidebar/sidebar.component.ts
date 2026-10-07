import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    if (typeof this.authService.logout === 'function') {
      this.authService.logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }

    this.router.navigate(['/login']);
  }
}