import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  constructor(
    private userServices: UserService,
    private groupService: GroupService,
    private router: Router,
    private routerActive: ActivatedRoute
  ) {}
  public activar: boolean = false;
  public data!: any;
  public gid!: string;
  @Output() actualizarInvitaciones = new EventEmitter<any>();

  ngOnInit(): void {
    this.routerActive.params.subscribe(({ id }) => {
      this.gid = id;
    });

    this.userServices.socket.on('invitationClient', (data) => {
      this.activarNotificacion(data);
    });
  }

  activarNotificacion(data: any): void {
    this.activar = !this.activar;
    this.data = data;
  }

  aceptarInvitacion(): void {
    this.groupService
      .addMemberGroup({
        gid: this.data.gid,
        uid: this.data.userInvited,
      })
      .subscribe((res) => {
        if (res.ok) {
          this.router.navigateByUrl(`/user/group/${res.data.gid}`);
          this.userServices.socket.emit('updateGroup');
        }
      });
    this.activar = false;
  }

  rechazarInvitacion(): void {
    this.groupService
      .deniedInvitationGroup({
        uid: this.data.userInvited,
        gid: this.data.gid,
      })
      .subscribe();
    this.activar = false;
  }

  cerrarInvitacion(): void {
    this.actualizarInvitaciones.emit();
    this.activar = false;
  }
}
