import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';

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
    private activatedRouter: ActivatedRoute
  ) {}

  stopPropagation(e: any): void {
    e.stopPropagation();
  }

  submitEditGroup(): void {
    this.groupService.editGroup(this.gid, this.editGroupForm.value).subscribe({
      next: (res) => {
        if (res.ok) {
          this.customError = res.msg;
          this.editGroup.emit(false);
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
}
