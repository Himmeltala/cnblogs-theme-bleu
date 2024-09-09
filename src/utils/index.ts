import * as BrowserModule from "./browser";
import * as FormatterModule from "./formatter";
import * as NativeModule from "./native";
import * as NavigationModule from "./navigation";
import * as PrettifyLogModule from "./prettify-log";
import * as StorageModule from "./storage";
import * as TextualModule from "./textual";
import * as RandomModule from "./random";

export namespace Utils {
  export const Browser: typeof BrowserModule = BrowserModule;
  export const Formatter: typeof FormatterModule = FormatterModule;
  export const Native: typeof NativeModule = NativeModule;
  export const Navigation: typeof NavigationModule = NavigationModule;
  export const PrettifyLog: typeof PrettifyLogModule = PrettifyLogModule;
  export const Storage: typeof StorageModule = StorageModule;
  export const Textual: typeof TextualModule = TextualModule;
  export const Random: typeof RandomModule = RandomModule;

  export function deepMerge(target: any, source: any) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === "object" && !Array.isArray(source[key])) {
          if (!target[key]) {
            target[key] = {};
          }
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }

  type EventHandler = (...args: any[]) => void;

  export class TypeWriter {
    private readonly el: string;
    private readonly texts: string[];
    private count: number;
    private index: number;
    private currentText: string;
    private letter: string;
    private readonly typingSpeed: number;
    private readonly eraseSpeed: number;
    private readonly eraseDelay: number;
    private readonly blinkSpace: number;
    private readonly rem: number;
    private readonly dom: HTMLElement;
    private typeTimer: ReturnType<typeof setTimeout> | null;
    private eraseTimer: ReturnType<typeof setTimeout> | null;
    private listeners: Record<string, EventHandler[]> = {};

    constructor({
                  el,
                  texts,
                  typingSpeed = 100,
                  eraseSpeed = 20,
                  eraseDelay = 2000,
                  blinkSpace = 5,
                  rem = 1
                }: {
      el: string;
      texts: string[];
      typingSpeed?: number;
      eraseSpeed?: number;
      eraseDelay?: number;
      blinkSpace?: number;
      rem?: number;
    }) {
      this.el = el;
      this.texts = texts;
      this.count = 0;
      this.index = 0;
      this.currentText = "";
      this.letter = "";
      this.typingSpeed = typingSpeed;
      this.eraseSpeed = eraseSpeed;
      this.eraseDelay = eraseDelay;
      this.blinkSpace = blinkSpace;
      this.rem = rem;
      this.typeTimer = null;
      this.eraseTimer = null;

      this.dom = document.getElementById(this.el);
    }

    private _offsetHeight: number;

    get offsetHeight(): number {
      return this._offsetHeight;
    }

    set offsetHeight(value: number) {
      this._offsetHeight = value;
    }

    private _offsetWidth: number;

    get offsetWidth(): number {
      return this._offsetWidth;
    }

    set offsetWidth(value: number) {
      this._offsetWidth = value;
    }

    on(eventName: string, handler: EventHandler): void {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(handler);
    }

    trigger(eventName: string, ...args: any[]): void {
      const handlers = this.listeners[eventName];
      if (handlers) {
        handlers.forEach(handler => handler(...args));
      }
    }

    startType(): void {
      this.currentText = this.texts[this.count];
      this.letter = this.currentText.slice(0, ++this.index);
      this.displayLetter();

      if (this.letter.length === this.currentText.length) {
        this.eraseTimer = setTimeout(() => this.eraseText(), this.eraseDelay);
      } else {
        this.typeTimer = setTimeout(() => this.startType(), this.typingSpeed);
      }
    }

    eraseText(): void {
      this.letter = this.currentText.slice(0, --this.index);
      this.displayLetter();

      if (this.letter.length === 0) {
        this.index = 0;
        this.count = (this.count + 1) % this.texts.length;
        this.clearDisplay();
        this.eraseTimer = setTimeout(() => this.startType(), 500);
      } else {
        this.typeTimer = setTimeout(() => this.eraseText(), this.eraseSpeed);
      }
    }

    displayLetter(): void {
      if (this.dom) {
        this.dom.textContent = this.letter;
        this.dom.style.width = `${this.getTextWidth(this.letter)}px`;
      }
    }

    clearDisplay(): void {
      if (this.dom) {
        this.dom.textContent = "";
      }
    }

    getTextWidth(text: string): number {
      const span = document.createElement("span");
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      span.style.fontSize = `${this.rem * rootFontSize}px`;
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.whiteSpace = "nowrap";
      span.textContent = text;
      document.body.appendChild(span);
      this.offsetHeight = span.offsetHeight;
      this.offsetWidth = span.offsetWidth;
      this.trigger("span", this.offsetHeight, this.offsetWidth);
      document.body.removeChild(span);
      return this.offsetWidth + this.blinkSpace;
    }

    clearTimers(): void {
      if (this.typeTimer) {
        clearTimeout(this.typeTimer);
      }
      if (this.eraseTimer) {
        clearTimeout(this.eraseTimer);
      }
    }
  }
}
