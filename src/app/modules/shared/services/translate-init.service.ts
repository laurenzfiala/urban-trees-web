import {Injectable} from '@angular/core';
import {Log} from './log.service';
import {TranslateService} from '@ngx-translate/core';

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

  constructor(private translate: TranslateService) {
  }

  /**
   * Call this in ngOnInit() within every module that needs translation.
   */
  public onModuleInit(): void {

    if (this.translate.currentLang) {
      return;
    }

    this.translate.addLangs(['en-GB', 'de-DE']);

    let userLang = window.navigator.language;

    let guessed;
    for (let lang of this.translate.getLangs()) {
      if (lang === userLang) {
        this.translate.use(lang);
        guessed = null;
        break;
      } else if (lang.startsWith(userLang.substring(0, userLang.indexOf('-') - 1))) {
        guessed = lang;
      }
    }

    if (guessed) {
      this.translate.use(guessed);
    } else {
      this.translate.setDefaultLang('en-GB');
    }

    this.translate.get('app.title').subscribe((translatedTitle: string) => {
      this.setTitle(translatedTitle);
    }, (e: any) => {
      TranslateInitService.LOG.error('Could not load title translation.');
      this.setTitle(TranslateInitService.APP_NAME);
    });

  }

  /**
   * Set document title.
   */
  private setTitle(newTitle: string) {
    document.title = newTitle;
  }

}
