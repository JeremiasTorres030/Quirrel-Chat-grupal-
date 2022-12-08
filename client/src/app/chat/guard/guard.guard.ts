import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class GuardGuard implements CanActivate, CanLoad {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    const validated = this.userService.validateUser().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigateByUrl('/login');
        }
      })
    );

    return validated;
  }
  canLoad(): Observable<boolean> | boolean {
    const validated = this.userService.validateUser().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigateByUrl('/login');
        }
      })
    );

    return validated;
  }
}
