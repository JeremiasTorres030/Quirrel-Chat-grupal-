import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { MessagesServices } from '../../services/messages.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent implements OnInit {
  public messageForm: FormGroup = this.fb.group({
    message: ['', [Validators.required]],
    type: ['text', [Validators.required]],
    uid: [this.userService.user.id, [Validators.required]],
  });

  @Output() messageEvent = new EventEmitter<any>();

  public socket = this.userService.socket;

  public id!: string;
  constructor(
    private messagesService: MessagesServices,
    private userService: UserService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe(({ id }) => {
      this.id = id;
    });

    this.socket.on('chat message', () => {
      this.groupService.getGroupMessages(this.id).subscribe((res) => {
        this.messageEvent.emit(res.messages);
      });
    });
  }

  sendMessageForm(): void {
    if (this.messageForm.valid) {
      this.messagesService
        .sendMessage(this.messageForm.value, this.id)
        .subscribe({
          next: (res) => {
            if (res.ok) {
              this.messageForm.get('message')?.reset('');
              this.socket.emit('chat message');
            }
          },
        });
    }
  }
}
