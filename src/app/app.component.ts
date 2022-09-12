import {Component, OnInit} from '@angular/core';
import {Log} from './modules/shared/services/log.service';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateInitService} from './modules/shared/services/translate-init.service';

@Component({
  selector: 'ut-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  private static LOG: Log = Log.newInstance(AppComponent);

  constructor(private router: Router,
              private translateInit: TranslateInitService) {
  }

  /**
   * Scroll to top after route changes
   * (only if route data allows it or does not exist)
   */
  public ngOnInit(): void {

    this.translateInit.onInit();

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd && (!this.router.getCurrentNavigation().extras.state || this.router.getCurrentNavigation().extras.state.scrollTop !== false)) {
        window.scrollTo(0, 0);
      }
    });

  }

}
