export interface User {
    email: string
    otp?: number
    otpExpiration?: number
    generateAccessToken: () => string
    generateRefreshToken: () => string
}
