import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'bkr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() changeState = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onchangeState(state: string) {
    this.changeState.emit(state);
  }
}
