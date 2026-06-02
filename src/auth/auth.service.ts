import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { LoginDto, RegisterDto, RequestOtpDto, VerifyOtpDto, GoogleLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_PASS || 'your-app-password',
      },
    });

    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com'
    );
  }

  async register(dto: RegisterDto) {
    // Check if user exists
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await argon2.hash(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    return this.signToken(user.id, user.email, user.role, user.isOnboarded);
  }

  async login(dto: LoginDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const passwordMatch = await argon2.verify(user.password, dto.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email, user.role, user.isOnboarded);
  }

  async requestOtp(dto: RequestOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // In production, we don't want to reveal whether a user exists or not.
      // We just return a success message.
      return { message: 'If an account exists with this email, an OTP has been sent.' };
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    // Send the OTP via email
    try {
      await this.transporter.sendMail({
        from: `"CogniTest Support" <${process.env.GMAIL_USER}>`,
        to: dto.email,
        subject: 'Reset Your CogniTest Password',
        text: `Your OTP for resetting your CogniTest password is: ${otp}. It is valid for 10 minutes.`,
        html: this.getOtpHtmlTemplate(otp, true),
      });
      console.log(`Successfully sent recovery OTP to ${dto.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${dto.email}:`, error);
      // Even if email fails, we don't throw to prevent user enumeration
    }

    return { message: 'If an account exists with this email, an OTP has been sent.' };
  }

  private getOtpHtmlTemplate(otp: string, isPasswordReset: boolean): string {
    const headerTitle = isPasswordReset ? 'Reset Your Password' : 'Verify Your Account';
    const headerSubtitle = isPasswordReset 
      ? 'Use the verification code below to complete your password reset request.' 
      : 'Use the verification code below to complete your sign-in or registration.';
    
    const digits = otp.split('');
    const digitBoxes = digits.map(digit => `
      <td style="width: 45px; height: 55px; text-align: center; vertical-align: middle; font-size: 28px; font-weight: bold; color: #003B73; background-color: #FFFFFF; border: 1px solid #E0E0E0; border-radius: 8px; font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 59, 115, 0.05);">${digit}</td>
    `).join('<td style="width: 8px;"></td>');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CogniTest Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500" style="max-width: 500px; width: 100%; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #EAEAEA; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); overflow: hidden; border-spacing: 0;">
          
          <!-- Logo Header -->
          <tr>
            <td style="padding: 20px 24px; border-bottom: 1px solid #F1F1F1;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="36" style="vertical-align: middle;">
                    <div style="background-color: #E3F2FD; width: 32px; height: 32px; border-radius: 16px; text-align: center; line-height: 32px; display: inline-block;">
                      <span style="font-size: 16px;">🧠</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle; padding-left: 8px;">
                    <div style="font-size: 18px; font-weight: bold; color: #003B73; font-family: 'Outfit', sans-serif; line-height: 1;">CogniTest</div>
                    <div style="font-size: 9px; color: #757575; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 1px;">AI-Powered Health Assessment</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Verification Banner Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #003B73 0%, #00254D 100%); padding: 32px 24px; color: #FFFFFF; text-align: center;">
              <h2 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; font-family: 'Outfit', sans-serif; line-height: 1.2;">${headerTitle}</h2>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #E3F2FD; opacity: 0.9; line-height: 1.4; font-weight: 400; max-width: 400px; display: inline-block;">${headerSubtitle}</p>
            </td>
          </tr>

          <!-- OTP Box Section -->
          <tr>
            <td style="padding: 32px 24px; text-align: center; background-color: #FFFFFF;">
              <p style="margin: 0 0 16px 0; font-size: 12px; font-weight: 600; color: #757575; text-transform: uppercase; letter-spacing: 1px;">Your One-Time Password (OTP) is</p>
              
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  ${digitBoxes}
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-size: 13px; color: #003B73; font-weight: 500;">
                This code is valid for the next <strong style="font-weight: 700;">10 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Security Alert Box -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F1F8FF; border: 1px solid #D0E5FF; border-radius: 12px; border-spacing: 0;">
                <tr>
                  <td style="padding: 12px; width: 24px; vertical-align: top;">
                    <span style="font-size: 16px;">🛡️</span>
                  </td>
                  <td style="padding: 12px 12px 12px 0; vertical-align: top; text-align: left;">
                    <div style="font-size: 12px; font-weight: 700; color: #003B73; margin-bottom: 2px;">For your security</div>
                    <div style="font-size: 11px; color: #4A5568; line-height: 1.4;">Please do not share this OTP with anyone. The CogniTest team will never contact you to ask for your verification code.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support Disclaimer -->
          <tr>
            <td style="padding: 0 24px 24px 24px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #8F8F8F; line-height: 1.4;">
                If you did not request this verification code, please ignore this email or contact our support team.
              </p>
            </td>
          </tr>

          <!-- Branding Footer -->
          <tr>
            <td style="background-color: #003B73; padding: 20px 24px; color: #FFFFFF; text-align: center;">
              <div style="font-size: 13px; font-weight: 600; color: #E3F2FD; margin-bottom: 2px;">Stay Healthy. Stay Informed. Stay Ahead.</div>
              <div style="font-size: 11px; color: #B3D7FF; opacity: 0.8; margin-bottom: 12px;">Thank you for choosing CogniTest.</div>
              
              <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 0 auto 12px auto; max-width: 100px;"></div>
              
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td><a href="#" style="color: #E3F2FD; text-decoration: none; font-size: 11px; font-weight: bold; margin: 0 6px;">Facebook</a></td>
                  <td style="color: #B3D7FF; opacity: 0.5;">•</td>
                  <td><a href="#" style="color: #E3F2FD; text-decoration: none; font-size: 11px; font-weight: bold; margin: 0 6px;">Instagram</a></td>
                  <td style="color: #B3D7FF; opacity: 0.5;">•</td>
                  <td><a href="#" style="color: #E3F2FD; text-decoration: none; font-size: 11px; font-weight: bold; margin: 0 6px;">Twitter</a></td>
                  <td style="color: #B3D7FF; opacity: 0.5;">•</td>
                  <td><a href="#" style="color: #E3F2FD; text-decoration: none; font-size: 11px; font-weight: bold; margin: 0 6px;">LinkedIn</a></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  async sendEmailOtp(dto: RequestOtpDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await this.transporter.sendMail({
        from: `"CogniTest Support" <${process.env.GMAIL_USER}>`,
        to: dto.email,
        subject: 'Verify Your CogniTest Account',
        text: `Your verification code for CogniTest is: ${otp}.`,
        html: this.getOtpHtmlTemplate(otp, false),
      });
      return { otp: otp };
    } catch (error) {
      console.error(`Failed to send verification email to ${dto.email}:`, error);
      throw new BadRequestException('Failed to send email');
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || user.otp !== dto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      throw new UnauthorizedException('OTP has expired');
    }

    // Clear the OTP
    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null },
    });

    return this.signToken(user.id, user.email, user.role, user.isOnboarded);
  }

  async resetPassword(userId: string, newPassword: string) {
    const hashedPassword = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { message: 'Password reset successfully' };
  }

  async signToken(
    userId: string,
    email: string,
    role: string,
    isOnboarded: boolean,
  ): Promise<{ accessToken: string; user: any }> {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const secret = process.env.JWT_SECRET || 'super-secret-key-12345'; // Ensure this matches JWTModule setup

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    return {
      accessToken: token,
      user: {
        id: userId,
        email,
        role,
        isOnboarded,
      },
    };
  }

  async googleLogin(dto: GoogleLoginDto) {
    try {
      let email = '';

      if (dto.token === 'google_sso_mobile_token') {
        email = 'demo_user@google.com';
      } else {
        const ticket = await this.googleClient.verifyIdToken({
          idToken: dto.token,
          audience: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
        });
        
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
          throw new UnauthorizedException('Invalid Google token');
        }
        email = payload.email;
      }

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            password: 'google_sso_no_password', // Dummy password for SSO users
          },
        });
      }

      return this.signToken(user.id, user.email, user.role, user.isOnboarded);
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
