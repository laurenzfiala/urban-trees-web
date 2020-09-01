import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit, Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {RenderService} from '../../services/render.service';
import {TextComponent} from '../text/text.component';
import {CmsComponent} from '../../interfaces/cms-component.interface';
import {SerializationService} from '../../services/serialization.service';
import {ContentService} from '../../services/content.service';
import {Content} from '../../entities/content.entity';

@Component({
  selector: 'ut-cms-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, AfterViewInit {

  private static componentMapping: Map<string, Type<unknown>> = new Map<string, Type<unknown>>(
    [
      ['TextComponent', TextComponent]
    ]
  );

  @Input('contentId')
  private contentId: string;

  @ViewChild('contentSlot', {read: ViewContainerRef})
  public contentSlot: ViewContainerRef;

  private content: Content;

  constructor(private resolver: ComponentFactoryResolver,
              private serializationService: SerializationService,
              private contentService: ContentService,
              private renderService: RenderService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    //this.renderService.render()
    //this.renderService.render(this.testDynInst, '<ut-cms-text>test456</ut-cms-text>');

    /*this.contentService.loadContent(this.contentId, content => {
      this.content = content;
    });*/
    this.content = Content.fromObject({
      version: 1,
      components: [
        {
          name: 'TextComponent',
          data: {
            text: 'test123'
          }
        },
        {
          name: 'TextComponent',
          data: {
            text: 'test4567'
          }
        }
      ]
    });

  }

  public ngAfterViewInit(): void {

    this.contentSlot.clear();
    for (let component of this.content.getComponents()) {
      const componentFactory = this.resolver.resolveComponentFactory(ContentComponent.componentMapping.get(component.getName()));
      const componentRef = this.contentSlot.createComponent(componentFactory);
      (<CmsComponent> componentRef.instance).deserialize(component.getData());
      this.cdRef.detectChanges();
    }

  }

}
