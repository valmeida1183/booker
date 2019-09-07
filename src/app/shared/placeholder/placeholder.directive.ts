import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[bkrPlaceholder]'
})
export class PlaceholderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
