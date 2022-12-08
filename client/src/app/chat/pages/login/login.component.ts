import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public customError!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private groupService: GroupService,
    private router: Router
  ) {}

  login(): void {
    if (this.loginForm.valid === true) {
      this.userService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.ok) {
            this.groupService.getAllUserGroups().subscribe();
            this.router.navigateByUrl('/user/lobby');
            this.userService.socket.emit('userID', res.data.id);
          }
        },
        error: (error) => {
          this.customError = error.error.msg;
        },
      });
    }
  }
}
