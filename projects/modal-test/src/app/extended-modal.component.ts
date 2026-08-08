import {ModalAbstract} from 'ngx-minimal-modal';
import { Component } from '@angular/core';

@Component({
  template: `
    <div style="background: #ffff; padding: 1rem 2rem">
      <h3> Modal with Inheritance </h3>
      <p>
        This modal was extended from the
        <code>
          ModalAbstract
        </code>
        abstract class
      </p>
      <button (click)="dismiss()">
        Dismiss
      </button>
    </div>
  `
})
export default class ExtendedModalComponent extends ModalAbstract {}
