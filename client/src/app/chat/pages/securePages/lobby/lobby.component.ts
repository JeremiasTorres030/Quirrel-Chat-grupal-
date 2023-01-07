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

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invitations = this.userService.user.invitations;
  }

  aceptarInvitacion(gid: string): void {
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
              this.userService.socket.emit(
                'updateGroup',
                res.groupData.members.map(({ uid }) => uid)
              );
            }
          });
          this.actualizarInvitacion();
        }
      });
  }

  rechazarInvitacion(gid: string): void {
    this.groupService
      .deniedInvitationGroup({
        uid: this.userService.user.uid,
        gid,
      })
      .subscribe((res) => {
        if (res.ok) {
          this.actualizarInvitacion();
        }
      });
  }

  actualizarInvitacion(): void {
    this.userService.getUserInvitations().subscribe((res) => {
      if (res.ok) {
        this.invitations = this.userService.user.invitations;
      }
    });
  }
}
