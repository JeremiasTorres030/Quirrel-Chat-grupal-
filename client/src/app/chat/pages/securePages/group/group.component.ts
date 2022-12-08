import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/chat/services/group.service';
import { UserService } from 'src/app/chat/services/user.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit, AfterViewChecked {
  public groupMessage!: Array<any>;
  public groupMembers!: Array<any>;
  public user: string = this.userService.user.username;
  public gid!: string;
  public gname!: string;
  public permisosDeAdmin: boolean = false;
  public editGroup: boolean = false;
  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private activeRoute: ActivatedRoute
  ) {}
  ngAfterViewChecked(): void {
    this.moverScroll();
  }

  ngOnInit(): void {
    this.activeRoute?.params?.subscribe(({ id }) => {
      this.gid = id;
      this.actualizarGrupo();
    });

    this.userService.socket.on('updateGroup', () => {
      this.actualizarGrupo();
      this.moverScroll();
    });
  }

  actualizarGrupo(): void {
    this.groupService.getUnicGroup(this.gid).subscribe((res: any) => {
      if (res.ok) {
        this.gname = res.groupData.groupname;
        this.rellenarMensajes(res.groupData.messages, res.membersData);
      }
    });
  }

  actualizarMensajes(event: any): void {
    this.rellenarMensajes(event, this.groupMembers);
  }

  rellenarMensajes = (messages: Array<any>, mebmers: Array<any>): void => {
    let arrayDATA: Array<any> = [];

    messages.forEach(({ userID, message, type }) => {
      const userdata = mebmers.find((element) => {
        return element.id === userID;
      });

      arrayDATA.push({ ...userdata, message, type });
    });

    this.groupMessage = arrayDATA;
    this.groupMembers = mebmers;

    this.admin();
  };

  moverScroll() {
    document.getElementById('chat')?.scrollTo(0, 10000);
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

  admin(): void {
    const user = this.groupMembers.find((user) => {
      return user.id === this.userService.user.id;
    });

    if (user.rol === 'admin') {
      this.permisosDeAdmin = true;
    } else {
      this.permisosDeAdmin = false;
    }
  }

  editGroupSucces(): void {
    this.editGroup = !this.editGroup;
    this.actualizarGrupo();
  }

  editGroupButton(): void {
    this.editGroup = !this.editGroup;
  }
}
