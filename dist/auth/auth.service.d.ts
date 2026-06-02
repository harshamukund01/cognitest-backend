import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, RequestOtpDto, VerifyOtpDto, GoogleLoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private transporter;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    requestOtp(dto: RequestOtpDto): Promise<{
        message: string;
    }>;
    private getOtpHtmlTemplate;
    sendEmailOtp(dto: RequestOtpDto): Promise<{
        otp: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    resetPassword(userId: string, newPassword: string): Promise<{
        message: string;
    }>;
    signToken(userId: string, email: string, role: string, isOnboarded: boolean): Promise<{
        accessToken: string;
        user: any;
    }>;
    googleLogin(dto: GoogleLoginDto): Promise<{
        accessToken: string;
        user: any;
    }>;
}
