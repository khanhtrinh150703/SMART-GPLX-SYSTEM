export class VerifyUserRequestDTO {
  readonly email: string;
  readonly otp: string;

  constructor(data: { email: string; otp: string }) {
    this.email = data.email;
    this.otp = data.otp;
  }
}