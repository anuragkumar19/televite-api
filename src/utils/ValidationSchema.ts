import Joi from 'joi'

export const loginSchema = Joi.object({
    email: Joi.string().lowercase().trim().email().required(),
})

export const verifyOtpSchema = Joi.object({
    email: Joi.string().lowercase().trim().email().required(),
    otp: Joi.number().min(1000).max(9999).required(),
})

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string(),
})
