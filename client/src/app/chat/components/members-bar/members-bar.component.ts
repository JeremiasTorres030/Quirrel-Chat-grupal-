import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-members-bar',
  templateUrl: './members-bar.component.html',
  styleUrls: ['./members-bar.component.css'],
})
export class MembersBarComponent implements OnInit {
  @Input() groupMembers!: Array<any>;
  @Input() permisosDeAdmin!: boolean;
  @Input() gname!: string;

  public listOfMembers!: Array<any>;
  public gid!: string;

  public mostrarInvitacion: boolean = false;
  public mostrarEliminarGrupo: boolean = false;

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    private userServices: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.gid = id;
    });
  }

  activarInvitacion(): void {
    this.mostrarInvitacion = !this.mostrarInvitacion;
    if (this.mostrarInvitacion) {
      this.userService.getAllusers().subscribe((res) => {
        this.listOfMembers = res.data;
      });
    }
  }

  salirDelGrupo(): void {
    this.groupService
      .exitGroup(this.userService.user.id, this.gid)
      .subscribe((res) => {
        if (res.ok) {
          this.userServices.socket.emit('updateGroup');
          this.router.navigateByUrl('/user/lobby');
        }
      });
  }

  imageError(event: any): void {
    if (event.target.alt.includes('user')) {
      event.target.src =
        'https://res.cloudinary.com/drifqbdtu/image/upload/v1663803554/Chat/profileImages/userDefaultImage_ci19ss.jpg';
    } else {
      event.target.src =
        'https://res.cloudinary.com/drifqbdtu/image/upload/v1663803197/Chat/groupImages/GroupImageDefault_bkwkek.jpg';
    }
  }

  eliminarGrupo(): void {
    this.mostrarEliminarGrupo = !this.mostrarEliminarGrupo;
  }
}
