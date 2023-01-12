import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordValidator } from '../../custom-validators/custom.validators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  public socket = this.userService.socket;
  public signUpForm: FormGroup = this.fb.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      image: [''],
      password: ['', [Validators.required]],
      passwordEqual: ['', [Validators.required]],
    },
    { validators: [passwordValidator] }
  );

  public customError!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  signup(): void {
    if (this.signUpForm.valid === true) {
      this.userService
        .signUp({
          username: this.signUpForm.get('username')?.value,
          email: this.signUpForm.get('email')?.value,
          image: this.signUpForm.get('image')?.value,
          password: this.signUpForm.get('password')?.value,
        })
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.router.navigateByUrl('/user/lobby');
              this.socket.emit('userID', res.data.uid);
            }
          },

          error: (error) => {
            this.customError = error.error.msg;
          },
        });
    }
  }
}
