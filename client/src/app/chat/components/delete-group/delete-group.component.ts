import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupMembers } from 'src/types';
import { deleteGroupValidator } from '../../custom-validators/custom.validators';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.css'],
})
export class DeleteGroupComponent implements OnInit {
  public socket = this.userService.socket;
  public gid!: string;
  @Input() gname!: string;
  @Input() gmembers!: Array<GroupMembers>;
  @Output() cerrarEliminarGrupo = new EventEmitter<boolean>();
  public formularioParaEliminar: FormGroup = this.fb.group(
    {
      gid: ['', Validators.required],
      nombre: ['', [Validators.required]],
      eliminar: ['', [Validators.required]],
    },
    { validators: [deleteGroupValidator] }
  );

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private activeRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activeRoute?.params?.subscribe(({ id }) => {
      this.gid = id;
    });

    this.formularioParaEliminar.get('nombre')?.setValue(this.gname);
    this.formularioParaEliminar.get('gid')?.setValue(this.gid);
  }

  eliminarGrupo(): void {
    if (this.formularioParaEliminar.valid) {
      this.groupService.deleteGroup(this.gid).subscribe((res) => {
        if (res.ok) {
          this.socket.emit(
            'deleteGroup',
            this.gmembers.map(({ uid }) => uid)
          );
        }
      });
    }
  }

  stopPropagation(e: MouseEvent): void {
    e.stopPropagation();
  }

  activarEliminarGrupo(): void {
    this.cerrarEliminarGrupo.emit(false);
  }
}
