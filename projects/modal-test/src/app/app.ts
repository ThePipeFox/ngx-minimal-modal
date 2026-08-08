import { Component, effect, inject } from '@angular/core';
import { ModalOutlet, ModalService } from 'ngx-minimal-modal';
import { ModalDemoComponent } from './modal-demo.component';
import ExtendedModalComponent from './extended-modal.component';

@Component({
  selector: 'app-root',
  imports: [ModalOutlet],
  template: `
    <h1> Modal Demo </h1>
    @if (viewModel.modalClosed) {
      <p> {{ viewModel.message }} </p>
    }
    <button type="button" (click)="openModalClicked()">
      Open Modal
    </button>
    <button type="button"
            style="margin-left: 0.75rem"
            (click)="openInheritedModalClicked()">
      Open Inherited Modal
    </button>
    <ngx-minimal-modal-outlet></ngx-minimal-modal-outlet>
  `,
  styles: ``,
})
export class App {

  private readonly _modalService = inject(ModalService);

  public viewModel = {
    modalClosed: false,
    message: ''
  };

  constructor() {
    effect(() => {
      this.viewModel.modalClosed = this._modalService.output();
      this.viewModel.message = this._modalService.output()?.message;

    });
  }

  public openModalClicked(): void {
    this._modalService.open(ModalDemoComponent, {
      inputs: {
        title: 'This Modal Works!',
        content: 'Congratulations. You have created a modal.'
      }
    });
  }

  public openInheritedModalClicked(): void {
    this._modalService.open(ExtendedModalComponent, {
      closeOnBackdropClick: false,
      closeOnEscapeKey: false
    });
  }
}
