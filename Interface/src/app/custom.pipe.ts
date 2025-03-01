import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'TimeAgo',
  standalone: true
})
export class CustomPipe implements PipeTransform {

  transform(value:Date|string|number):string{
    if(!value)return 'Invalid date';
    return formatDistanceToNow(new Date(value),{addSuffix:true})
  }
}
