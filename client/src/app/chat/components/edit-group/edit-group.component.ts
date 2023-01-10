import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupMembers } from 'src/types';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css'],
})
export class EditGroupComponent implements OnInit {
  public editGroupForm: FormGroup = this.fb.group({
    groupname: [''],
    image: [''],
  });

  public gid!: string;
  public socket = this.userService.socket;
  @Input() gmembers: Array<GroupMembers> = [];

  public customError!: string;

  @Output() public editGroup = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(({ id }) => {
      this.gid = id;
    });
  }

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private activatedRouter: ActivatedRoute,
    private userService: UserService
  ) {}

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  submitEditGroup(): void {
    this.groupService.editGroup(this.gid, this.editGroupForm.value).subscribe({
      next: (res) => {
        if (res.ok) {
          this.customError = res.msg;
          this.editGroup.emit();
          this.socket.emit(
            'editGroup',
            this.gmembers.map(({ uid }) => uid)
          );
        }
      },
      error: (error) => {
        this.customError = error.error.msg;
      },
    });
  }

  editButton(): boolean {
    if (
      this.editGroupForm.get('groupname')?.value === '' &&
      this.editGroupForm.get('image')?.value === ''
    ) {
      return true;
    }

    return false;
  }

  closeEditCard(): void {
    this.editGroup.emit(false);
  }
}
