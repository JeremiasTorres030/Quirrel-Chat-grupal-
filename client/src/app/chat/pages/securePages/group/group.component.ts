import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/chat/services/group.service';
import { UserService } from 'src/app/chat/services/user.service';
import { GroupMembers, GroupMembersMessages, GroupMessages } from 'src/types';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit, AfterViewChecked {
  public groupMessage!: Array<GroupMessages | GroupMembersMessages>;
  public groupMembers!: Array<GroupMembers>;
  public user: string = this.userService.user.uid;
  public gid!: string;
  public gname!: string;
  public permisosDeAdmin: boolean = false;
  public editGroup: boolean = false;
  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private router: Router
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

    this.userService.socket.on('editGroup', () => {
      this.actualizarGrupo();
    });
  }

  actualizarGrupo(): void {
    this.groupService.getUnicGroup(this.gid).subscribe({
      next: (res) => {
        if (res.ok) {
          this.gname = res.groupData.groupname;
          this.rellenarMensajes(res.groupData.messages, res.membersData);
        }
      },
      error: () => {
        console.log(this.gid);
        this.router.navigateByUrl('/user/lobby');
      },
    });
  }

  actualizarMensajes(event: Array<GroupMessages>): void {
    this.rellenarMensajes(event, this.groupMembers);
  }

  rellenarMensajes = (
    messages: Array<GroupMessages>,
    members: Array<GroupMembers>
  ): void => {
    let arrayDATA: Array<GroupMembersMessages> = [];

    messages.forEach(({ uid, message, type }) => {
      const userdata = members.find((element) => {
        return element.uid === uid;
      });

      if (userdata?.uid) {
        arrayDATA.push({ ...userdata, message, type });
      }
    });

    this.groupMessage = arrayDATA;
    this.groupMembers = members;

    this.admin();
  };

  moverScroll(): void {
    document.getElementById('chat')?.scrollTo(0, 10000);
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

  admin(): void {
    const user = this.groupMembers.find(
      (user) => user.uid === this.userService.user.uid
    );

    if (user !== undefined) {
      if (user.rol === 'admin') {
        this.permisosDeAdmin = true;
      } else {
        this.permisosDeAdmin = false;
      }
    }
  }

  editGroupButton(): void {
    this.editGroup = !this.editGroup;
  }
}
