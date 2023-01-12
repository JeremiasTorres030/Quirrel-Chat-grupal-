import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupMembers } from 'src/types';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-member-invitation',
  templateUrl: './member-invitation.component.html',
  styleUrls: ['./member-invitation.component.css'],
})
export class MemberInvitationComponent implements OnInit {
  @Output() activateInvitation = new EventEmitter<boolean>();
  @Input() public listOfMembers!: Array<GroupMembers>;
  public socket = this.userService.socket;
  public customError!: string;
  public gid!: string;
  public showListOfMembers!: Array<GroupMembers>;
  public invitationForm: FormGroup = this.fb.group({
    member: ['', [Validators.required]],
    memberID: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.gid = id;
    });

    this.invitationForm
      .get('member')
      ?.valueChanges.subscribe((res) => this.searcher(res));
  }

  closeInvitation(): void {
    this.activateInvitation.emit(false);
  }

  stopPropagation(e: MouseEvent): void {
    e.stopPropagation();
  }

  selectUser(id: string, username: string | undefined): void {
    this.invitationForm.get('member')?.setValue(username);
    this.invitationForm.get('memberID')?.setValue(id);
  }

  searcher(res: string): void {
    const value = res.toLowerCase();
    const usersFounded = this.listOfMembers?.filter((user) => {
      return user.username?.toLowerCase().includes(value);
    });

    this.showListOfMembers = usersFounded;
  }

  sendInvitation(): void {
    if (this.invitationForm.valid) {
      this.groupService
        .sendInvitationGroup({
          inviteid: this.invitationForm.get('memberID')?.value,
          uid: this.userService.user.uid,
          gid: this.gid,
        })
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.customError = 'Invitacion enviada';
              this.socket.emit('invitation', {
                user: res.data.user,
                groupname: res.data.groupname,
                gid: res.data.gid,
                userInvited: res.data.userInvited,
              });
            }
          },

          error: (error) => {
            this.customError = error.error.msg;
          },
        });
    }
  }
  imageError(event: Event): void {
    if ((event.target as HTMLImageElement).alt.includes('user')) {
      (event.target as HTMLImageElement).src =
        'https://res.cloudinary.com/drifqbdtu/image/upload/v1663803554/Chat/profileImages/userDefaultImage_ci19ss.jpg';
    } else {
      (event.target as HTMLImageElement).src =
        'https://res.cloudinary.com/drifqbdtu/image/upload/v1663803197/Chat/groupImages/GroupImageDefault_bkwkek.jpg';
    }
  }
}
