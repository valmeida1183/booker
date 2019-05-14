import { Component } from '@angular/core';

@Component({
  selector: 'bkr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  state = 'recipe';

  onStateChanged(state: string) {
    this.state = state;
  }
}
