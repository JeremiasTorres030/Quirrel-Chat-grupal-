import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupMembers } from 'src/types';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-members-bar',
  templateUrl: './members-bar.component.html',
  styleUrls: ['./members-bar.component.css'],
})
export class MembersBarComponent implements OnInit {
  @Input() groupMembers!: Array<GroupMembers>;
  @Input() adminRole!: boolean;
  @Input() gname!: string;
  public socket = this.userService.socket;
  public listOfMembers!: Array<GroupMembers>;
  public gid!: string;
  public showInvitationForm: boolean = false;
  public showDeleteGroupForm: boolean = false;
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

  activateInvitationForm(): void {
    this.showInvitationForm = !this.showInvitationForm;
    if (this.showInvitationForm) {
      this.userService.getAllusers().subscribe((res) => {
        this.listOfMembers = res.data;
      });
    }
  }

  exitGroup(): void {
    this.groupService
      .exitGroup(this.userService.user.uid, this.gid)
      .subscribe((res) => {
        if (res.ok) {
          this.socket.emit(
            'updateGroup',
            this.groupMembers.map(({ uid }) => uid)
          );
          this.router.navigateByUrl('/user/lobby');
        }
      });
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

  deleteGroup(): void {
    this.showDeleteGroupForm = !this.showDeleteGroupForm;
  }
}
