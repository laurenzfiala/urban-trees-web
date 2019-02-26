import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BObservationComponent} from './components/phenology/observation/b-observation/b-observation.component';
import {Log} from './services/log.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'ut-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  private static LOG: Log = Log.newInstance(AppComponent);

  /**
   * Fallback name of the app.
   */
  public static APP_NAME = 'Urban Trees';

  // TODO rework this
  constructor(private translate: TranslateService,
              private router: Router) {

    translate.addLangs(['en-GB', 'de-DE']);
    translate.setDefaultLang('en-GB');

    let userLang = window.navigator.language;


    let guessed;
    for (let lang of translate.getLangs()) {
      if (lang === userLang) {
        translate.use(lang);
        guessed = null;
        break;
      } else if (lang.startsWith(userLang.substring(0, userLang.indexOf('-') - 1))) {
        guessed = lang;
      }
    }

    if (guessed) {
      translate.use(guessed);
    }

    translate.get('app.title').subscribe((translatedTitle: string) => {
      this.setTitle(translatedTitle);
    }, (e: any) => {
      AppComponent.LOG.error('Could not load title translation.');
      this.setTitle(AppComponent.APP_NAME);
    });

  }

  private setTitle(newTitle: string) {
    document.title = newTitle;
  }

  /**
   * Scroll to top after route changes
   */
  public ngOnInit(): void {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

  }

}
