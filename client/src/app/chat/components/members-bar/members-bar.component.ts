import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  public listOfMembers!: Array<any>;

  public showListOfMembers!: Array<any>;

  public gid!: string;

  public errorPersonalizado!: string;

  public formularioDeInvitacion: FormGroup = this.fb.group({
    miembro: ['', [Validators.required]],
    miembroID: ['', [Validators.required]],
  });

  public mostrarInvitacion: boolean = false;

  constructor(
    private fb: FormBuilder,
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

    this.formularioDeInvitacion
      .get('miembro')
      ?.valueChanges.subscribe((res) => this.buscador(res));
  }

  activarInvitacion(): void {
    this.formularioDeInvitacion.get('miembro')?.setValue('');
    this.formularioDeInvitacion.get('miembroID')?.setValue('');
    this.mostrarInvitacion = !this.mostrarInvitacion;
    if (this.mostrarInvitacion) {
      this.userService.getAllusers().subscribe((res) => {
        this.listOfMembers = res.data;
      });
    }
  }

  seleccionarUsuario(id: string, username: string): void {
    this.formularioDeInvitacion.get('miembro')?.setValue(username);
    this.formularioDeInvitacion.get('miembroID')?.setValue(id);
  }

  buscador(res: string): void {
    const value = res.toLowerCase();

    const usersFounded = this.listOfMembers?.filter((user) => {
      return user.username.toLowerCase().includes(value);
    });

    this.showListOfMembers = usersFounded;
  }

  enviarInvitacion(): void {
    if (this.formularioDeInvitacion.valid) {
      this.groupService
        .sendInvitationGroup({
          inviteid: this.formularioDeInvitacion.get('miembroID')?.value,
          uid: this.userService.user.id,
          gid: this.gid,
        })
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.errorPersonalizado = 'Invitacion enviada';
              this.userService.socket.emit('invitation', {
                user: res.data.username,
                groupname: res.data.groupName,
                gid: res.data.groupID,
                userInvited: res.data.userInvited,
              });
            }
          },

          error: (error) => {
            this.errorPersonalizado = error.error.msg;
          },
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

  prueba(e: MouseEvent): void {
    e.stopPropagation();
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
}
