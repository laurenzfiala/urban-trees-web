import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {TabDirective, TabsetComponent} from 'ngx-bootstrap/tabs';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'ut-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.less']
})
export class JournalComponent implements OnInit {

  private static SUBSCRIPTION_TAG: string = 'journal-cmp';

  public JournalTabs = JournalTabs;
  public selectedTab: JournalTabs = JournalTabs.EXP_DAYS;
  private fragmentSub: Subscription;

  constructor(private subs: SubscriptionManagerService,
              private route: ActivatedRoute,
              private router: Router,
              private cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {

    this.fragmentSub = this.route.fragment.subscribe((fragment: string) => {
      for (let tab in JournalTabs) {
        if (JournalTabs[tab] === fragment) {
          this.selectedTab = JournalTabs[tab];
          this.fragmentSub?.unsubscribe();
          break;
        }
      }
    });

  }

  /**
   * Call whenever a new tab is selected.
   * @param tab the selected tab
   */
  public selectTab(tab: JournalTabs): void {

    this.selectedTab = tab;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        fragment: tab,
        replaceUrl: true,
        state: {'scrollTop': false}
      });

  }

}

export enum JournalTabs {
  EXP_DAYS = 'experimentationDays',
  MODULE_SENSOR2APP = 'sensor2App',
  MODULE_APP2ANALYSE = 'app2Analyse'
}
