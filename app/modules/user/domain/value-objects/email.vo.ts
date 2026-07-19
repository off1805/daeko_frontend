import { ValueObject } from "~/shared/domain/value-object";

interface EmailProps {
  value: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(value: string): Email {
    if (!EMAIL_PATTERN.test(value)) {
      throw new Error(`Invalid email: "${value}"`);
    }
    return new Email({ value });
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
