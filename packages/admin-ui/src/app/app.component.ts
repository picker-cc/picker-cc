import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'vdr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor() {}

  ngOnInit() {
    // this.loading$ = this.dataService.client
    //   .getNetworkStatus()
    //   .stream$.pipe(map(data => 0 < data.networkStatus.inFlightRequests));
  }
}
