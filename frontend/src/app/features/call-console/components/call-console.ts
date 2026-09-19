import { Component, computed, effect, inject, signal } from '@angular/core';
import type { CaliAddress } from '../../../core/api/interfaces/cali-address.interface';
import { EmergenciesStore } from '../../../core/state/emergencies.store';
import { CALL_PREFIX } from '../constants/speech.constant';
import { SpeechRecognitionService } from '../services/speech-recognition.service';
import { SpeechSynthesisService } from '../services/speech-synthesis.service';

/**
 * Consola de llamadas. Dos formas de que entre una emergencia:
 *
 *  1. **Generar llamada** — el simulador elige un guion y una dirección real
 *     de Cali al azar, y el navegador la LEE EN VOZ ALTA.
 *  2. **Hablar** — la Web Speech API transcribe tu voz en vivo.
 *
 * En los dos casos el texto queda visible y editable antes de despachar,
 * porque la transcripción se equivoca y en triaje eso importa.
 */
@Component({
  selector: 'app-call-console',
  templateUrl: './call-console.html',
  styleUrl: './call-console.scss',
})
export class CallConsole {
  private readonly store = inject(EmergenciesStore);
  protected readonly recognition = inject(SpeechRecognitionService);
  protected readonly synthesis = inject(SpeechSynthesisService);

  protected readonly addresses = this.store.addresses;
  protected readonly addressLabel = signal('');
  protected readonly editedText = signal('');

  /** La llamada que se está viendo ahora. */
  protected readonly current = this.store.selected;

  /**
   * Una llamada recibida (generada o ya despachada) se muestra en modo
   * lectura: es un registro, no un borrador. Solo lo que dictás es editable.
   */
  protected readonly readOnly = computed(
    () => !this.recognition.listening() && this.editedText().length === 0 && !!this.current(),
  );

  /** El texto que se ve en el cuadro. */
  protected readonly boxText = computed(() =>
    this.readOnly() ? (this.current()?.reportText ?? '') : this.editedText(),
  );

  /** De dónde viene el texto que se está mostrando. */
  protected readonly boxSource = computed(() => {
    if (this.recognition.listening()) return 'escuchando';
    if (this.readOnly()) return 'llamada recibida';
    return 'borrador';
  });

  private lastSpokenId: string | null = null;

  protected readonly canSubmit = computed(
    () =>
      this.editedText().trim().length >= 6 &&
      this.addressLabel().length > 0 &&
      !this.recognition.listening(),
  );

  constructor() {
    // Al terminar de dictar, el texto pasa al campo editable.
    effect(() => {
      const text = this.recognition.finalText();
      if (text && !this.recognition.listening()) this.editedText.set(text);
    });

    // Solo se anuncia lo que ACABA de entrar por WebSocket.
    //
    // No se mira `emergencies()[0]`: esa lista se llena también al cargar la
    // página desde el historial, y entonces la app hablaría sola al abrirse.
    effect(() => {
      const incomingId = this.store.incomingCallId();
      if (!incomingId || incomingId === this.lastSpokenId) return;

      const call = this.store.emergencies().find((e) => e.id === incomingId);
      if (!call) return;

      this.lastSpokenId = incomingId;
      this.synthesis.speak(`${CALL_PREFIX} ${call.addressLabel}. ${call.reportText}`);
    });
  }

  protected generate(): void {
    // Un borrador a medias no debe tapar la llamada que va a entrar.
    this.editedText.set('');
    this.recognition.reset();
    this.store.generateCall();
  }

  /** Sale del modo lectura para dictar o escribir una llamada nueva. */
  protected startNew(): void {
    this.editedText.set(' ');
  }

  protected toggleMic(): void {
    if (this.recognition.listening()) {
      this.recognition.stop();
      return;
    }
    this.editedText.set('');
    this.recognition.start();
  }

  protected onTextInput(event: Event): void {
    this.editedText.set((event.target as HTMLTextAreaElement).value);
  }

  protected onAddressChange(event: Event): void {
    this.addressLabel.set((event.target as HTMLSelectElement).value);
  }

  /** Envía la llamada dictada a la dirección elegida. */
  protected submit(): void {
    const address = this.addresses().find(
      (a: CaliAddress) => a.label === this.addressLabel(),
    );
    if (!address) return;

    this.store.submitVoiceCall({
      reportText: this.editedText().trim(),
      addressLabel: address.label,
      latitude: address.latitude,
      longitude: address.longitude,
    });

    this.editedText.set('');
    this.recognition.reset();
  }
}
