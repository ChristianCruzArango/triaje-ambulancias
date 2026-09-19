import { Injectable, signal } from '@angular/core';
import { SPEECH_LANG } from '../constants/speech.constant';

/**
 * Transcripción de voz con la Web Speech API del navegador.
 *
 * Gratis, sin clave y en tiempo real. Funciona en Chrome.
 *
 * ⚠️ Chrome envía el audio a servidores de Google para transcribir. Para una
 * demostración no importa; para pacientes reales habría que usar un modelo de
 * audio propio.
 *
 * ⚠️ La transcripción SE EQUIVOCA. En triaje eso es grave: "no puede respirar"
 * contra "puede respirar" es una palabra y una prioridad distinta. Por eso el
 * texto queda visible y editable antes de confirmar.
 */
@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  readonly supported = signal(false);
  readonly listening = signal(false);
  /** Texto ya confirmado por el motor. */
  readonly finalText = signal('');
  /** Texto provisional, que aún puede cambiar. */
  readonly interimText = signal('');

  private recognition?: any;

  constructor() {
    const Ctor =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    this.supported.set(Boolean(Ctor));
    if (!Ctor) return;

    this.recognition = new Ctor();
    this.recognition.lang = SPEECH_LANG;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += chunk;
        else interim += chunk;
      }
      if (final) this.finalText.update((t) => (t + ' ' + final).trim());
      this.interimText.set(interim);
    };

    this.recognition.onerror = () => this.listening.set(false);
    this.recognition.onend = () => this.listening.set(false);
  }

  start(): void {
    if (!this.recognition || this.listening()) return;
    this.finalText.set('');
    this.interimText.set('');
    this.listening.set(true);
    this.recognition.start();
  }

  stop(): void {
    this.recognition?.stop();
    this.listening.set(false);
    this.interimText.set('');
  }

  reset(): void {
    this.finalText.set('');
    this.interimText.set('');
  }
}
