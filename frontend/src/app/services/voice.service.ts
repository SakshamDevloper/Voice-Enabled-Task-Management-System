import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface VoiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

@Injectable({ providedIn: 'root' })
export class VoiceService {
  private recognition: any;
  private isListening$ = new BehaviorSubject<boolean>(false);
  private transcript$ = new BehaviorSubject<string>('');
  private error$ = new BehaviorSubject<string>('');
  private confidence$ = new BehaviorSubject<number>(0);

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      this.error$.next('Speech Recognition not supported in your browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening$.next(true);
      this.error$.next('');
    };

    this.recognition.onend = () => {
      this.isListening$.next(false);
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (finalTranscript) {
        const confidence = event.results[event.results.length - 1][0].confidence;
        this.transcript$.next(finalTranscript.trim());
        this.confidence$.next(confidence);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.error$.next(`Speech recognition error: ${event.error}`);
    };
  }

  startListening(config: VoiceConfig = {}): void {
    if (!this.recognition) {
      this.error$.next('Speech Recognition not available');
      return;
    }

    this.recognition.language = config.language || 'en-US';
    this.recognition.continuous = config.continuous || false;
    this.recognition.interimResults = config.interimResults || true;
    this.recognition.maxAlternatives = config.maxAlternatives || 1;

    this.transcript$.next('');
    this.error$.next('');
    this.recognition.start();
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  abortListening(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening$.next(false);
    }
  }

  getIsListening(): Observable<boolean> {
    return this.isListening$.asObservable();
  }

  getTranscript(): Observable<string> {
    return this.transcript$.asObservable();
  }

  getError(): Observable<string> {
    return this.error$.asObservable();
  }

  getConfidence(): Observable<number> {
    return this.confidence$.asObservable();
  }

  speak(text: string, rate = 1): void {
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  isSupported(): boolean {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return !!SpeechRecognition && 'speechSynthesis' in window;
  }
}
