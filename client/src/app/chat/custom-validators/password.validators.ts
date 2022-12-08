import { AbstractControl } from '@angular/forms';

export const passwordValidator = (control: AbstractControl): null | {} => {
  if (control.get('password')?.value !== control.get('passwordEqual')?.value) {
    return {
      notEqual: true,
    };
  }

  return null;
};
