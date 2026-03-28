export interface IEmailService {
    sendOtpEmail(recipientEmail: string, otpCode: string): Promise<void>;
}