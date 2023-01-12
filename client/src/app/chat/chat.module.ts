import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { ChatRoutingModule } from './chat-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LobbyComponent } from './pages/securePages/lobby/lobby.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { GroupComponent } from './pages/securePages/group/group.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { MembersBarComponent } from './components/members-bar/members-bar.component';
import { NotificationComponent } from './components/notification/notification.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { UsernameNotFoundPipe } from './pipes/username-not-found.pipe';
import { EditGroupComponent } from './components/edit-group/edit-group.component';
import { DeleteGroupComponent } from './components/delete-group/delete-group.component';
import { MemberInvitationComponent } from './components/member-invitation/member-invitation.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    LobbyComponent,
    SidebarComponent,
    GroupComponent,
    ChatInputComponent,
    MembersBarComponent,
    NotificationComponent,
    EditProfileComponent,
    UsernameNotFoundPipe,
    EditGroupComponent,
    DeleteGroupComponent,
    MemberInvitationComponent,
  ],
  imports: [CommonModule, ChatRoutingModule, ReactiveFormsModule, LayoutModule],
})
export class ChatModule {}
