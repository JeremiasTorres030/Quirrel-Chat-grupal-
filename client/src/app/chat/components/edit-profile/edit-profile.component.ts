import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent {
  constructor(private fb: FormBuilder, private userService: UserService) {}

  public editUserForm: FormGroup = this.fb.group({
    username: [''],
    image: [''],
  });

  public customError!: string;

  @Output() public editProfile = new EventEmitter<boolean>();

  stopPropagation(e: any): void {
    e.stopPropagation();
  }

  submitEditProfile(): void {
    this.userService.editUser(this.editUserForm.value).subscribe({
      next: (res) => {
        if (res.ok) {
          this.userService.user.username = res.data?.username;
          this.userService.user.image = res.data?.image;

          this.customError = res.msg;

          this.editProfile.emit(false);
        }
      },
      error: (error) => {
        this.customError = error.error.msg;
      },
    });
  }

  editButton(): boolean {
    if (
      this.editUserForm.get('username')?.value === '' &&
      this.editUserForm.get('image')?.value === ''
    ) {
      return true;
    }

    return false;
  }
}
