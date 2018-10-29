import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ut-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.less']
})
export class TextEditorComponent implements OnInit {

  public selection: Selection = document.getSelection();

  constructor() { }

  ngOnInit() {
  }

  public bold() {
    let range = this.selection.getRangeAt(0);
    range.deleteContents();

    let el = document.createElement('b');
    //el.innerHTML = range.cloneContents().pa;

    //range.insertNode();

  }

}
