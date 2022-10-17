import {Injectable} from '@angular/core';
import {Log} from './log.service';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';

/**
 * Service to initialize ngx-translate properly.
 *
 * @author Laurenz Fiala
 * @since 2020/03/14
 */
@Injectable()
export class TranslateInitService {

  private static LOG: Log = Log.newInstance(TranslateInitService);

  /**
   * Fallback name of the app.
   */
  public static APP_NAME = 'Urban Trees';

  constructor(private translate: TranslateService,
              private title: Title) {
  }

  /**
   * Call this in ngOnInit() within app component.
   */
  public onInit(): void {

    if (this.translate.currentLang) {
      return;
    }

    this.translate.setDefaultLang('de-DE');
    this.translate.addLangs(['de-DE']);
    this.translate.use('de-DE');

    let userLang = this.translate.getBrowserLang();
    let userCultureLang = this.translate.getBrowserCultureLang();

    /*let guessed;
    for (let lang of this.translate.getLangs()) {
      if (lang === userCultureLang) {
        guessed = lang;
        break;
      } else if (lang.startsWith(userLang)) {
        guessed = lang;
      }
    }

    if (guessed) {
      this.translate.use(guessed);
    } else {
      this.translate.setDefaultLang('en-GB');
    }*/

    const titleSub = this.translate.get('app.title').subscribe((translatedTitle: string) => {
      this.setTitle(translatedTitle);
      titleSub.unsubscribe();
    }, (e: any) => {
      TranslateInitService.LOG.error('Could not load title translation.');
      this.setTitle(TranslateInitService.APP_NAME);
      titleSub.unsubscribe();
    });

  }

  /**
   * Set document title.
   */
  private setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

}
