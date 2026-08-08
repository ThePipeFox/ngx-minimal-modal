import { Component, inject, input } from '@angular/core';
import { ModalService } from 'ngx-minimal-modal';

@Component({
  selector: 'app-modal-demo',
  imports: [],
  template: `
    <div class="modal-body">
      <h3> {{title()}} </h3>
      <p> {{content()}} </p>
      <button type="button" (click)="closeClicked()">
        Close Modal
      </button>
    </div>
  `,
  styles: `
    .modal-body {
      background: #fff;
      border-radius: 1rem;
      min-width: 250px;
      padding: 1rem 2rem;
    }
  `,
  standalone: true
})
export class ModalDemoComponent {

  private readonly _modalService = inject(ModalService);

  public title = input('');
  public content = input('');

  public closeClicked(): void {
    this._modalService.close({ message: 'You have passed data from the modal.'});
  }
}
