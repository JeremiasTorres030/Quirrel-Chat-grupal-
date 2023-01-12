import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationData } from 'src/types';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  public activate: boolean = false;
  public data!: InvitationData;
  public gid!: string;
  public socket = this.userServices.socket;
  @Output() updateInivtationsList = new EventEmitter<void>();
  constructor(
    private userServices: UserService,
    private groupService: GroupService,
    private router: Router,
    private routerActive: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.socket.off('invitationClient');
    this.routerActive.params.subscribe(({ id }) => {
      this.gid = id;
    });

    this.socket.on('invitationClient', (data) => {
      this.activateNotification(data);
    });
  }

  activateNotification(data: InvitationData): void {
    this.activate = !this.activate;
    this.data = data;
  }

  acceptInvitation(): void {
    this.groupService
      .addMemberGroup({
        gid: this.data.gid,
        uid: this.data.userInvited,
      })
      .subscribe((res) => {
        if (res.ok) {
          this.router.navigateByUrl(`/user/group/${res.data.gid}`);
          this.groupService.getUnicGroup(res.data.gid).subscribe((res) => {
            if (res.ok) {
              this.userServices.socket.emit(
                'updateGroup',
                res.groupData.members.map(({ uid }) => uid)
              );
            }
          });
        }
      });
    this.activate = false;
  }

  declineInvitation(): void {
    this.groupService
      .deniedInvitationGroup({
        uid: this.data.userInvited,
        gid: this.data.gid,
      })
      .subscribe();
    this.activate = false;
  }

  closeInvitation(): void {
    this.updateInivtationsList.emit();
    this.activate = false;
  }
}
