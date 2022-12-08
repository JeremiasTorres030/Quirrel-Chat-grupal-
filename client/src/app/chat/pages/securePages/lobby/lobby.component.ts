import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/chat/services/group.service';
import { UserService } from 'src/app/chat/services/user.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  public invitations!: Array<any>;

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
        uid: this.userService.user.id,
      })
      .subscribe((res) => {
        if (res.ok) {
          this.router.navigateByUrl(`/user/group/${res.data.gid}`);
          this.userService.socket.emit('updateGroup');
        }
      });
  }

  rechazarInvitacion(gid: string): void {
    this.groupService
      .deniedInvitationGroup({
        uid: this.userService.user.id,
        gid,
      })
      .subscribe();
  }
}
