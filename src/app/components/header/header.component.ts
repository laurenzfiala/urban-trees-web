import { Component, OnInit } from '@angular/core';
import {AnnouncementService} from '../../services/announcement.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ut-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(private announcementService: AnnouncementService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this.announcementService.load();
  }

  get announcements() {
    return this.announcementService.getAnnouncements();
  }

  get currentLanguage(): string {
    return this.translateService.currentLang ? this.translateService.currentLang : this.translateService.defaultLang;
  }

  get availableLanguages(): Array<string> {
    return this.translateService.getLangs();
  }

  public setLanguage(lang: string) {
    this.translateService.use(lang);
  }

}
