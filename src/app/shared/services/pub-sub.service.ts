import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PubSubService {
  private subjects: Subject<any>[] = [];

  publish(eventName: any) {
      // ensure a subject for the event name exists
      this.subjects[eventName] = this.subjects[eventName] || new Subject<any>();

      // publish event
      this.subjects[eventName].next(null);
  }

  on(eventName: any): Observable<any> {
      // ensure a subject for the event name exists
      this.subjects[eventName] = this.subjects[eventName] || new Subject<any>();

      // return observable
      return this.subjects[eventName].asObservable();
  }
}
