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

export const requestSchema = Joi.object({
    uid: Joi.number().min(1000000000).max(9999999999).required(),
})

export const updateNameSchema = Joi.object({
    name: Joi.string().trim().required(),
})
