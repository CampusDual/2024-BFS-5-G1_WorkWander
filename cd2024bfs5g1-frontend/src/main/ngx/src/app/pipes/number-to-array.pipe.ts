import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToArray',
})
export class NumberToArrayPipe implements PipeTransform {
  transform(value: number): any[] {
    return Array.from({ length: value });
  }
}