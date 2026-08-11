import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private isOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpen.asObservable();

  toggleSearch() {
    this.isOpen.next(!this.isOpen.value);
  }

  closeSearch() {
    this.isOpen.next(false);
  }

  openSearch() {
    this.isOpen.next(true);
  }
}
