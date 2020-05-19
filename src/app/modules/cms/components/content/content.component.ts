import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnInit,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {RenderService} from '../../services/render.service';
import {TextComponent} from '../text/text.component';
import {CmsComponent} from '../../interfaces/cms-component.inerface';

@Component({
  selector: 'ut-cms-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent implements OnInit, AfterViewInit {

  @ViewChildren('componentSlot', {read: ViewContainerRef})
  public componentSlots: QueryList<ViewContainerRef>;

  constructor(private resolver: ComponentFactoryResolver,
              private renderService: RenderService) { }

  ngOnInit(): void {
    //this.renderService.render()
    //this.renderService.render(this.testDynInst, '<ut-cms-text>test456</ut-cms-text>');
  }

  public ngAfterViewInit(): void {

    for (let componentSlot of this.componentSlots.toArray()) {
      const componentFactory = this.resolver.resolveComponentFactory(TextComponent);
      componentSlot.clear();
      const componentRef = componentSlot.createComponent(componentFactory);
      (<CmsComponent> componentRef.instance).deserialize('{"text": "test0999"}');
    }

  }

}
