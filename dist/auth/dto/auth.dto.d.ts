export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
}
export declare class RequestOtpDto {
    email: string;
}
export declare class VerifyOtpDto {
    email: string;
    otp: string;
}
export declare class GoogleLoginDto {
    token: string;
}
export declare class ResetPasswordDto {
    newPassword: string;
}
