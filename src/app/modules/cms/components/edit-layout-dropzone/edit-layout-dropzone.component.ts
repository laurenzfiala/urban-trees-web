import {Component, OnInit} from '@angular/core';
import {ContentService} from '../../services/content.service';

@Component({
  selector: 'ut-edit-layout-dropzone',
  templateUrl: './edit-layout-dropzone.component.html',
  styleUrls: ['./edit-layout-dropzone.component.less']
})
export class EditLayoutDropzoneComponent implements OnInit {

  public dragOver: boolean = false;
  public hiding: boolean = false;
  public inserted: boolean = false;

  /**
   * TODO doc
   */
  public index: number;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.onElementDropped().subscribe({
      next: value => {
        this.hiding = true;
      }
    });
  }

  public insert(): void {
    this.inserted = true;
    this.contentService.elementDropped(this.index);
  }


}
