import { Injectable, signal } from '@angular/core';
import { SPEECH_LANG, SPEECH_RATE } from '../constants/speech.constant';

/**
 * Lee en voz alta las llamadas simuladas, para que se OIGA entrar la llamada.
 * Usa `speechSynthesis` del navegador: gratis y sin clave.
 */
@Injectable({ providedIn: 'root' })
export class SpeechSynthesisService {
  readonly speaking = signal(false);
  readonly enabled = signal(true);

  speak(text: string): void {
    if (!this.enabled() || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG;
    utterance.rate = SPEECH_RATE;
    utterance.onstart = () => this.speaking.set(true);
    utterance.onend = () => this.speaking.set(false);
    utterance.onerror = () => this.speaking.set(false);
    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    window.speechSynthesis?.cancel();
    this.speaking.set(false);
  }

  toggle(): void {
    this.enabled.update((v) => !v);
    if (!this.enabled()) this.stop();
  }
}
