import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'desayuno'
})
export class DesayunoPipe implements PipeTransform {

  transform(valor: number): string {
    if (valor === 1) {
      return 'si';
    } else {
      return 'no';
    }
  }

}
