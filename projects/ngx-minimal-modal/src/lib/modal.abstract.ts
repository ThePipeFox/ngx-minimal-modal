import { inject, Injectable } from '@angular/core';
import { ModalService } from './modal.service';

@Injectable()
export abstract class ModalAbstract {
  protected readonly modalService = inject(ModalService);

  public dismiss(): void {
    this.modalService.close();
  }

  public close(data: any): void {
    this.modalService.close(data);
  }

}
