import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[bkrDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') opened = false;

  constructor() { }

  @HostListener('click') toggleOpen() {
    this.opened = !this.opened;
  }
}
