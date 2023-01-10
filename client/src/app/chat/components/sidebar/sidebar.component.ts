import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, Groups } from 'src/types';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements AfterViewInit, OnInit {
  public groupForm: FormGroup = this.fb.group({
    groupname: ['', [Validators.required, Validators.minLength(3)]],
    image: [''],
  });

  public socket = this.userService.socket;
  public ventana: boolean = false;
  public user!: User;
  public userGroups: Array<Groups> = [];
  public userOptions: boolean = false;
  public editProfile: boolean = false;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;

    this.userService.socket.on('editGroup', () => {
      this.groupService.getAllUserGroups().subscribe((res) => {
        if (res.ok) {
          if (res.groupData !== undefined) {
            this.userGroups = res.groupData;
          }
        }
      });
    });

    this.userService.socket.on('deleteGroup', () => {
      this.groupService.getAllUserGroups().subscribe((res) => {
        if (res.ok) {
          if (res.groupData !== undefined) {
            this.userGroups = res.groupData;
          }
        }
      });

      this.router.navigateByUrl('/user/lobby');
    });
  }

  ngAfterViewInit(): void {
    this.groupService.getAllUserGroups().subscribe((res) => {
      if (res.ok) {
        if (res.groupData !== undefined) {
          this.userGroups = res.groupData;
        }
      }
    });
  }

  ventanaCrear(): void {
    this.ventana = !this.ventana;
  }

  crearGrupo(): void {
    if (this.groupForm.valid) {
      this.groupService.createGroup(this.groupForm.value).subscribe((res) => {
        if (res.ok) {
          this.userGroups.push(res.data);
          this.ventanaCrear();
        }
      });
    }
  }

  stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  userConfig(): void {
    this.userOptions = !this.userOptions;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.userService.user = {
      email: '',
      groups: [],
      uid: '',
      image: '',
      invitations: [],
      username: '',
    };

    this.router.navigateByUrl('/inicio');
  }

  editarPerfil(): void {
    this.editProfile = !this.editProfile;
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
