import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupMembers } from 'src/types';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-memeber-invitation',
  templateUrl: './memeber-invitation.component.html',
  styleUrls: ['./memeber-invitation.component.css'],
})
export class MemeberInvitationComponent implements OnInit {
  @Output() activarInvitacion = new EventEmitter<boolean>();

  public errorPersonalizado!: string;
  public gid!: string;

  @Input() public listOfMembers!: Array<GroupMembers>;
  public showListOfMembers!: Array<GroupMembers>;

  public formularioDeInvitacion: FormGroup = this.fb.group({
    miembro: ['', [Validators.required]],
    miembroID: ['', [Validators.required]],
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

    this.formularioDeInvitacion
      .get('miembro')
      ?.valueChanges.subscribe((res) => this.buscador(res));
  }

  cerrarInvitacion(): void {
    this.activarInvitacion.emit(false);
  }

  stopPropagation(e: MouseEvent): void {
    e.stopPropagation();
  }

  seleccionarUsuario(id: string, username: string | undefined): void {
    this.formularioDeInvitacion.get('miembro')?.setValue(username);
    this.formularioDeInvitacion.get('miembroID')?.setValue(id);
  }

  buscador(res: string): void {
    const value = res.toLowerCase();

    const usersFounded = this.listOfMembers?.filter((user) => {
      return user.username?.toLowerCase().includes(value);
    });

    this.showListOfMembers = usersFounded;
  }

  enviarInvitacion(): void {
    if (this.formularioDeInvitacion.valid) {
      this.groupService
        .sendInvitationGroup({
          inviteid: this.formularioDeInvitacion.get('miembroID')?.value,
          uid: this.userService.user.uid,
          gid: this.gid,
        })
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.errorPersonalizado = 'Invitacion enviada';
              this.userService.socket.emit('invitation', {
                user: res.data.user,
                groupname: res.data.groupname,
                gid: res.data.gid,
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