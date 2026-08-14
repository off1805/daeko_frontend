import type { ClockPort } from "../../application/ports";

/** Implémentation réelle de ClockPort, via l'horloge système. */
export class SystemClock implements ClockPort {
  maintenant(): string {
    return new Date().toISOString();
  }
}