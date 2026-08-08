# NGX Minimal Modal 

## Introduction

Minimal Modal is a small, unopinionated library that provides a straightforward way to work
with modals (pop-ups) in an Angular app.

Key features:

- Small & simple: only 186 lines of code in total.
- No external dependencies: use any CSS & other 3rd party components you want.
- Flexible: intentionally does not include modal templates, giving you complete control over how to render them.
- Leverages Angular [signals](https://angular.dev/guide/signals) for core functionality.

## Installation

At the time of this writing, only NPM ins supported:

`npm install ngx-minimal-modal`

## Basic Usage

Add the `ngx-minimal-modal-outlet` to any component you want to support modals in. This will 
probably be your `app.ts` or some sort of layout component (assuming you want to support modals globally):

```angular
@Component({
  selector: 'app-root',
  imports: [ModalOutlet],
  template: `
    <h1> This component supports modals. </h1>
    <ngx-minimal-modal-outlet></ngx-minimal-modal-outlet>
  `,
  styles: ``,
})
export class App {
// component code
}
```

Inject `ModalService` to whichever component you're opening a modal from:

```typescript
import { Component } from '@angular/core';

@Component({
  template: `
  <button type="button" (click)="openModalClicked()">
      Open Modal
  </button>
  `
})
export class MyComponent {
  private readonly _modalService = inject(ModalService);

  public openModalClicked(): void {
    this._modalService.open(MyModalComponent);
  }

}
```

where `MyModalComponent` can be any Angular component, for example:

```angular
@Component({
  selector: 'my-modal',
  imports: [],
  template: `
    <div class="modal-body">
      <h3> This is a Modal! </h3>
      <p> You have successfully opened a modal! Congrats! </p>
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

    public closeClicked(): void {
        this._modalService.close();
    }
}
```

The library includes a utility abstraction - `ModalAbstract` - that you can extend your modals
from for convenience. This abstract class holds the current instance of `ModalService` and
provides utility methods for closing the current modal:

```typescript
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
```

so you can do something like:

```typescript
import { Component } from '@angular/core';

@Component({ ... })
export default class ExtendedModalComponent extends ModalAbstract {
}
```

The library does not include any sort of modal template by design, as this is fairly easy to implement
and can vary greatly depending on your project needs.

## Modal Options

The `open` method of `ModalService` takes an optional `ModalOptions` instance as the 2nd argument;
you can  use it to control basic aspects of how the modal is rendered and what data is passed
to it; the type is defined as:

```typescript
export type ModalOptions = {
  inputs?: any,
  closeOnBackdropClick?: boolean,
  closeOnEscapeKey?: boolean,
  backdropClass?: string,
  position?: 'top' | 'center' | 'bottom',
  offset?: number,
};
```

where:

- `inputs`: data you want to pass to the modal (see below).
- `closeOnBackdropClick`: determines whether clicking outside the modal will close it. Defaults to `true`.
- `closeOnEscapeKey`: determines whether pressing the escape key on your keyboard will close the modal. Defaults to `true`.
- `backdropClass`: allows you to pass additional CSS classes to be applied to the backdrop. By default, a class that sets the background to 25% black is applied. Note that this class will **not** be applied if you pass custom classes.
- `position`: determines the position of the modal.
- `offset`: determines the margin, in pixels, that will be applied to the modal. This will be the top margin if position is set to `top` or `center` (offsetting
the window from the top) or the bottom margin if `position` is set to `bottom` (offsetting the modal from the bottom of the screen).


## Passing Data to a Modal

Given a modal component with inputs defined like this:

```typescript
export class ModalDemoComponent {
  public title = input('');
  public content = input('');
}
```

you can use `ModalOptions` when opening the modal to pass input data into the component:

```typescript

export default class ModalContainer {
  private readonly _modalService = inject(ModalService);
  
  
  public openModalWithInputs(): void {
    this._modalService.open(ModalDemoComponent, {
      inputs: {
        title: 'This Modal Works!',
        content: 'Congratulations. You have created a modal.'
      }
    });
  }
  
}
```

## Handling Modal Closed Events

You can use an [effect](https://angular.dev/api/core/effect) to "subscribe" to the `output`
signal of `ModalService`. In the following example, the `App` component will react to data being
returned from a modal component:

```typescript
import { Component } from '@angular/core';

@Component({
  template: `
    <button type="button" (click)="closeClicked()"> Close Modal </button>
  `
})
export class ModalComponent {

  private readonly _modalService = inject(ModalService);

  public closeClicked(): void {
    this._modalService.close({ message: 'You have passed data from the modal.' });
  }
}
```

```typescript
import { Component } from '@angular/core';

@Component({
  template: `
   @if (viewModel.modalClosed) {
      <p> {{ viewModel.message }} </p>
    }
  `
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
}
```

**Note** that when the escape key or clicking outside the modal is used to close it, `output` will always
be equal to `null`.

**Note** that `ModalService` is a *singleton*, meaning that all components that use `effect` to react
to the `output` signal will receive to the **same** signal value.

## Current Limitations

This library is basically an offshoot of code written for personal use and as such is very basic.
At the time of this writing, the limitations of the library are as follows:

- Only one modal can be open at a time; there is no modal instance management.
- It is not possible to pass data from the modal when it's dismissed using the escape key or by clicking outside the modal window.
- Since the modal service is a singleton, care needs to be taken not do execute redundant code in multiple components when a modal is closed.


