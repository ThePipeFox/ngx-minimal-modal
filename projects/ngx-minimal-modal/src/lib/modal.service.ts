import { computed, Injectable, Signal, signal, Type } from '@angular/core';
import { ModalOptions } from './modal-options.type';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly _defaultOptions: ModalOptions = {
    closeOnBackdropClick: true,
    closeOnEscapeKey: true,
    position: 'center',
    offset: 0
  };

  private _component = signal<Type<any> | null>(null);
  private _output = signal<any | null>(null);
  private _options = signal<any | null>(null);

  public isModalOpen = computed(() => this._component() !== null);
  public modalInstance = this._component.asReadonly();
  public modalOptions: Signal<ModalOptions> = computed(() => this._options() ?? this._defaultOptions);
  public output = this._output.asReadonly();

  public open(component: Type<any>, options: ModalOptions | null = null): void {
    this._component.set(component);
    this._options.set({
      inputs: options?.inputs || null,
      closeOnBackdropClick: options?.closeOnBackdropClick ?? this._defaultOptions.closeOnBackdropClick,
      closeOnEscapeKey: options?.closeOnEscapeKey ?? this._defaultOptions.closeOnEscapeKey,
      backdropClass: options?.backdropClass ?? '',
      position: options?.position ?? this._defaultOptions.position,
      offset: options?.offset ?? this._defaultOptions.offset,
    });
    this._output.set(null);
  }

  public close(outputData: any | null = null): void {
    this._output.set(outputData);
    this._component.set(null);
    this._options.set(null);
  }
}
