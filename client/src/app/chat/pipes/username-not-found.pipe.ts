import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usernameNotFound',
})
export class UsernameNotFoundPipe implements PipeTransform {
  transform(username: string | undefined): string {
    if (username === undefined) {
      return 'Usuario no encontrado';
    }

    return username;
  }
}
