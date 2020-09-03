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
import {Toolbar, ToolbarBtn, ToolbarDropdown, ToolbarElement} from '../../entities/toolbar.entity';

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

  public ToolBarBtn = ToolbarBtn;

  @Input('contentId')
  private contentId: string;

  @ViewChild('contentSlot', {read: ViewContainerRef})
  public contentSlot: ViewContainerRef;

  public toolbar: Toolbar;

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
    this.toolbar = new Toolbar();
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
    for (let serializedCmp of this.content.getComponents()) {
      const componentFactory = this.resolver.resolveComponentFactory(ContentComponent.componentMapping.get(serializedCmp.getName()));
      const componentRef = this.contentSlot.createComponent(componentFactory);
      const component = <CmsComponent> componentRef.instance;

      component.deserialize(serializedCmp.getData());
      this.toolbar.register(component);
      this.toolbar.update(component);

      this.cdRef.detectChanges();
    }

  }

  public isToolbarBtn(el: ToolbarElement): el is ToolbarBtn {
    return el instanceof ToolbarBtn;
  }

  public isToolbarDropdown(el: ToolbarElement): el is ToolbarDropdown {
    return el instanceof ToolbarDropdown;
  }

}
