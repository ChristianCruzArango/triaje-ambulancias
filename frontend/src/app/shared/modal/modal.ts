import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  input,
  output,
  viewChild,
} from '@angular/core';

/**
 * Diálogo a pantalla completa.
 *
 * Usa el elemento nativo `<dialog>` con `showModal()`, y eso NO es un detalle:
 * los paneles de la sala de control tienen `backdrop-filter`, que crea un
 * bloque contenedor y atrapa dentro del panel a cualquier hijo
 * `position: fixed`. Un `<dialog>` modal se dibuja en la capa superior del
 * navegador y escapa de todos sus ancestros.
 *
 * Además trae gratis el cierre con Escape y el foco atrapado dentro.
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal implements AfterViewInit, OnDestroy {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly closed = output<void>();

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  ngAfterViewInit(): void {
    const element = this.dialog().nativeElement;
    if (!element.open) element.showModal();
  }

  ngOnDestroy(): void {
    const element = this.dialog()?.nativeElement;
    if (element?.open) element.close();
  }

  /** Cierra al pulsar Escape o al hacer clic fuera. */
  protected onClose(): void {
    this.closed.emit();
  }

  /** Un clic sobre el propio `<dialog>` es un clic en el fondo. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.closed.emit();
  }
}
