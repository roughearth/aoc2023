import {Day} from '../days';

type LogMessage = (ct: number, duration: number) => string | number;

export type SafetyNet = {
  fails: (logMessage?: LogMessage) => boolean;
  isSafe: (logMessage?: LogMessage) => boolean;
  reason: string;
  duration: number;
  loops: number;
}

export function safetyNet({
  maxLoops = 1e4,
  maxMs = 5_000,
  logLoopInterval = 0,
  logMsInterval = 0
}: Day['meta'] = {}): SafetyNet {
  let start = performance.now();
  let ct = 0;
  let duration = 0;
  let reason = "pass";
  let lastLogMs = 0;

  return {
    fails(logMessage) {
      duration = this.duration;
      if (++ct > maxLoops){
        reason = "Too many loops. Controlled by `meta.maxLoops`.  Use a `logMessage` function to show intermediate steps.";
        return true;
      }
      if (duration > maxMs) {
        reason = "Too long. Controlled by `meta.maxMs`. Use a `logMessage` function to show intermediate steps.";
        return true;
      }

      const logLoops = logMessage && (logLoopInterval > 0);
      const logMs = logMessage && (logMsInterval > 0);

      if (logLoops && !(ct % logLoopInterval)) {
        console.log(logMessage(ct, duration))
      }

      if (logMs && ((duration - lastLogMs) >= logMsInterval)) {
        lastLogMs = duration;
        console.log(logMessage(ct, duration))
      }

      return false;
    },
    isSafe(logMessage) {
      if (this.fails(logMessage)) {
        throw new Error(this.reason);
      }
      return true;
    },
    get reason() {
      return `${reason} (${ct} loops in ${duration}ms)`;
    },
    get duration() { return Math.round(performance.now() - start); },
    get loops() { return ct; }
  };
}

export const simpleSafetyLog: Parameters<SafetyNet['fails']>[0] = (ct, d) => `${ct} @ ${d}ms`;
