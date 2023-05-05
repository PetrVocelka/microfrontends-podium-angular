import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {
  counter = 0;

  constructor() { }

  ngOnInit(): void {
  }

  incrementCounter() {
    this.counter++;
  }
}
