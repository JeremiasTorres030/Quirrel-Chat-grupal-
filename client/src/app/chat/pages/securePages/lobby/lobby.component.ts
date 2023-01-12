import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/chat/services/group.service';
import { UserService } from 'src/app/chat/services/user.service';
import { Invivtations } from 'src/types';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  public invitations!: Array<Invivtations>;
  public socket = this.userService.socket;

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invitations = this.userService.user.invitations;
  }

  acceptInvitation(gid: string): void {
    this.groupService
      .addMemberGroup({
        gid,
        uid: this.userService.user.uid,
      })
      .subscribe((res) => {
        if (res.ok) {
          this.router.navigateByUrl(`/user/group/${res.data.gid}`);
          this.groupService.getUnicGroup(res.data.gid).subscribe((res) => {
            if (res.ok) {
              this.socket.emit(
                'updateGroup',
                res.groupData.members.map(({ uid }) => uid)
              );
            }
          });
          this.updateInvitations();
        }
      });
  }

  declineInvitation(gid: string): void {
    this.groupService
      .deniedInvitationGroup({
        uid: this.userService.user.uid,
        gid,
      })
      .subscribe((res) => {
        if (res.ok) {
          this.updateInvitations();
        }
      });
  }

  updateInvitations(): void {
    this.userService.getUserInvitations().subscribe((res) => {
      if (res.ok) {
        this.invitations = this.userService.user.invitations;
      }
    });
  }
}
