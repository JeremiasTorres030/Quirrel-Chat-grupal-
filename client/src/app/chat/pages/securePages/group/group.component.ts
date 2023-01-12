import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GroupService } from 'src/app/chat/services/group.service';
import { UserService } from 'src/app/chat/services/user.service';
import { GroupMembers, GroupMessages } from 'src/types';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit, AfterViewChecked {
  public groupMessage!: Array<GroupMessages>;
  public groupMembers!: Array<GroupMembers>;
  public user: string = this.userService.user.uid;
  public gid!: string;
  public gname!: string;
  public adminRole: boolean = false;
  public editGroup: boolean = false;
  public smallScreen!: boolean;
  public hideSideBar!: boolean;
  public hideMembersBar!: boolean;
  public socket = this.userService.socket;
  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}
  ngAfterViewChecked(): void {
    this.moveScrollBar();
  }

  ngOnInit(): void {
    this.socket.off('updateGroup');
    this.socket.off('editGroup');
    this.breakpointObserver
      .observe(['(min-width: 901px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.smallScreen = true;
          this.hideMembersBar = true;
          this.hideSideBar = true;
        } else {
          this.smallScreen = false;
          this.hideMembersBar = false;
          this.hideSideBar = false;
        }
      });

    this.activeRoute?.params?.subscribe(({ id }) => {
      this.gid = id;
      this.updateGroup();
    });

    this.socket.on('updateGroup', () => {
      this.updateGroup();
      this.moveScrollBar();
    });

    this.socket.on('editGroup', () => {
      this.updateGroup();
    });
  }

  updateGroup(): void {
    this.groupService.getUnicGroup(this.gid).subscribe({
      next: (res) => {
        if (res.ok) {
          this.gname = res.groupData.groupname;
          this.fillMessagesData(res.groupData.messages, res.membersData);
        }
      },
      error: () => {
        this.router.navigateByUrl('/user/lobby');
      },
    });
  }

  updateMessages(event: Array<GroupMessages>): void {
    this.fillMessagesData(event, this.groupMembers);
    this.moveScrollBar();
  }

  fillMessagesData = (
    messages: Array<GroupMessages>,
    members: Array<GroupMembers>
  ): void => {
    let arrayDATA: Array<GroupMessages> = [];

    messages.forEach(({ uid, message, type }) => {
      const userdata = members.find((element) => {
        return element.uid === uid;
      });

      arrayDATA.push({ ...userdata, message, type });
    });

    this.groupMessage = arrayDATA;
    this.groupMembers = members;

    this.admin();
  };

  moveScrollBar(): void {
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
        this.adminRole = true;
      } else {
        this.adminRole = false;
      }
    }
  }

  editGroupButton(): void {
    this.editGroup = !this.editGroup;
  }

  hideSideBarButton(): void {
    this.hideSideBar = !this.hideSideBar;
  }

  hideMemberBarButton(): void {
    this.hideMembersBar = !this.hideMembersBar;
  }
}
