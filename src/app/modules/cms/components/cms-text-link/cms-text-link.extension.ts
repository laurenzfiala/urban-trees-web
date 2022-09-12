import { Injector } from '@angular/core';
import { Node, mergeAttributes } from '@tiptap/core';
import { AngularNodeViewRenderer } from 'ngx-tiptap';
import {CmsTextLinkComponent} from './cms-text-link.component';

const CmsTextLinkComponentExtension = (injector: Injector): Node => {
  return Node.create({
    name: 'cmsTextLink',
    inline: true,
    group: 'inline',
    parseHTML() {
      return [{ tag: 'cms-text-link' }];
    },
    renderHTML({ HTMLAttributes }) {
      return ['cms-text-link', mergeAttributes(HTMLAttributes)];
    },
    addNodeView() {
      return AngularNodeViewRenderer(CmsTextLinkComponent, { injector });
    },
    addAttributes() {
      return {
        href: {
          parseHTML: element => element.getAttribute('href'),
        },
        text: {
          parseHTML: element => element.getAttribute('text'),
        }
      };
    },
  });
};

export default CmsTextLinkComponentExtension;
