import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IEmailService } from '@/domain/interfaces/services/external/commands/i-email.service';

export class NodemailerService implements IEmailService {
    private transporter: nodemailer.Transporter;
    
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        } as SMTPTransport.Options);
    }

    // Tuân thủ đúng hợp đồng từ tầng Domain
    async sendOtpEmail(recipientEmail: string, otpCode: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: '"Hệ thống Xác thực" <no-reply@domain.com>',
                to: recipientEmail,
                subject: 'Mã xác thực OTP của bạn',
                text: `Mã xác thực của bạn là: ${otpCode}. Mã này sẽ hết hạn trong 5 phút.`,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`[Email Error]: ${error.message}`);
            }
            throw new Error('Không thể gửi email OTP lúc này.');
        }
    }
}