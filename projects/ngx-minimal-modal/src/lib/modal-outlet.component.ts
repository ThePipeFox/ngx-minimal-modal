import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { ModalService } from './modal.service';
import { NgClass, NgComponentOutlet, NgStyle } from '@angular/common';

@Component({
  selector: 'ngx-minimal-modal-outlet',
  standalone: true,
  template: `
    @if (modalService.isModalOpen()) {
      <div
        class="ngx-minimal-modal-overlay {{
          modalService.modalOptions().backdropClass || 'backdrop-default'
        }}"
        [ngClass]="{
          'content-bottom': modalService.modalOptions().position === 'bottom',
          'content-center': modalService.modalOptions().position === 'center',
          'content-top': modalService.modalOptions().position === 'top',
        }">
        <div
          #modalContentRef
          [ngStyle]="{
            'margin-top.px': contentMarginTop(),
            'margin-bottom.px': contentMarginBottom(),
          }">
          <ng-container
            *ngComponentOutlet="
              modalService.modalInstance();
              inputs: modalService.modalOptions().inputs
            ">
          </ng-container>
        </div>
      </div>
    }
  `,
  styles: `
    .ngx-minimal-modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100vh !important;
      z-index: 999;
      display: flex !important;
    }

    .ngx-minimal-modal-overlay.backdrop-default {
      background-color: rgba(0, 0, 0, 0.25);
    }

    .ngx-minimal-modal-overlay.content-bottom {
      justify-content: center;
      align-items: flex-end;
    }

    .ngx-minimal-modal-overlay.content-top {
      justify-content: center;
      align-items: flex-start;
    }

    .ngx-minimal-modal-overlay.content-center {
      align-items: center;
      justify-content: center;
    }
  `,
  imports: [NgComponentOutlet, NgClass, NgStyle],
  host: {
    '(document:keydown.escape)': `(escapeKeyPressed())`,
    '(document:click)': 'documentClicked($event.target)',
  },
})
export class ModalOutlet {
  public modalService = inject(ModalService);

  public contentMarginTop = computed(() => {
    if (!this.modalService.modalOptions().offset || this.modalService.modalOptions().offset === 0) {
      return 0;
    }

    return this.modalService.modalOptions().position === 'top' ||
      this.modalService.modalOptions().position === 'center'
      ? this.modalService.modalOptions().offset
      : 0;
  });

  public contentMarginBottom = computed(() => {
    if (!this.modalService.modalOptions().offset || this.modalService.modalOptions().offset === 0) {
      return 0;
    }

    return this.modalService.modalOptions().position === 'bottom'
      ? this.modalService.modalOptions().offset
      : 0;
  });

  @ViewChild('modalContentRef') modalContentRef!: ElementRef;

  public escapeKeyPressed() {
    if (!this.modalService.modalOptions().closeOnEscapeKey) {
      return;
    }

    this.modalService.close();
  }

  public documentClicked(targetElement: any) {
    if (!targetElement
      || !this.modalContentRef
      || this.modalContentRef.nativeElement.contains(targetElement)
      || !this.modalService.modalOptions().closeOnBackdropClick) {
      return;
    }

    this.modalService.close();

  }
}
