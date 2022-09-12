import {Component, OnInit} from '@angular/core';
import {AngularNodeViewComponent} from 'ngx-tiptap';
import {EnvironmentService} from '../../../shared/services/environment.service';

@Component({
  selector: 'ut-cms-text-link',
  templateUrl: './cms-text-link.component.html',
  styleUrls: ['./cms-text-link.component.less']
})
export class CmsTextLinkComponent extends AngularNodeViewComponent implements OnInit {

  public isOnSiteLink: boolean = false;
  public href: string;
  public domain: string;
  public text: string;

  constructor(private envService: EnvironmentService) {
    super();
  }

  ngOnInit() {

    this.href = this.node.attrs.href;
    const hrefHasProtocol = (/[a-z0-9]{2,}:\/\//g).test(this.href);
    const hrefWithoutProtocol = hrefHasProtocol ? this.href.slice(this.href.indexOf('//') + 2) : this.href;
    const hrefDomainEndIndex = hrefWithoutProtocol.indexOf('/');
    if (hrefDomainEndIndex === -1) {
      this.domain = hrefWithoutProtocol;
    } else {
      this.domain = hrefWithoutProtocol.slice(0, hrefDomainEndIndex);
    }
    const webHost = this.envService.endpoints.webHost;
    if (this.href.startsWith(webHost)) {
      this.href = this.href.slice(webHost.length);
      this.isOnSiteLink = true;
    } else if (this.href.startsWith('/') || this.href.startsWith('.')) {
      this.isOnSiteLink = true;
    } else if (!hrefHasProtocol) {
      this.href = 'http://' + this.href;
    }
    this.text = this.node.attrs.text;

  }

}
