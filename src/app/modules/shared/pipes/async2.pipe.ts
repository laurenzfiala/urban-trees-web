import {ChangeDetectorRef, Pipe, PipeTransform} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

/**
 * TODO
 */
@Pipe({name: 'async2'})
export class Async2Pipe<T> implements PipeTransform {

  private value: T;
  private subscribed: boolean = false;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  transform(value: T | Observable<T> | Promise<T>): T {
    if (value instanceof Observable<T>) {
      if (!this.subscribed) {
        this.subscribed = true;
        (value as Observable<T>).pipe(first()).subscribe(v => {
          this.subscribed = false;
          this.value = v;
          this.cdRef.detectChanges();
        });
      }
      if (this.value) {
        return this.value;
      }
    } else if (value instanceof Promise<T>) {
      if (this.value) {
        return this.value;
      }
      if (!this.subscribed) {
        this.subscribed = true;
        (value as Promise<T>).then(v => {
          this.value = v;
          this.cdRef.detectChanges();
        });
      }
    } else {
      this.value = value;
      return value;
    }
  }

}
