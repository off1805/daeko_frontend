import type { IdGeneratorPort } from "../../application/ports";


export class UuidGenerator implements IdGeneratorPort {
  generer(): string {
    return crypto.randomUUID();
  }
}