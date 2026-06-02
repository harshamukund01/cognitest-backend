import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RequestOtpDto, VerifyOtpDto, GoogleLoginDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    sendEmailOtp(dto: RequestOtpDto): Promise<{
        otp: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    googleLogin(dto: GoogleLoginDto): Promise<{
        accessToken: string;
        user: any;
    }>;
    resetPassword(authHeader: string, body: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
