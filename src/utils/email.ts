import ejs from 'ejs'
import {
    createTestAccount,
    createTransport,
    getTestMessageUrl,
} from 'nodemailer'
import path from 'path'
import { __prod__ } from '../constants'

async function getTransporter() {
    let options = {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        secure: __prod__,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    }

    if (!__prod__) {
        const testAccount = await createTestAccount()

        options.host = testAccount.smtp.host
        options.port = testAccount.smtp.port
        options.auth.user = testAccount.user
        options.auth.pass = testAccount.pass
    }

    return createTransport(options)
}

export const sendOtp = async (email: string, otp: number) => {
    const transporter = await getTransporter()

    const html = await ejs.renderFile(
        path.join(__dirname, '../', '../', 'views', 'emails', 'otp.ejs'),
        { otp }
    )

    const info = await transporter.sendMail({
        to: email,
        from: process.env.EMAIL || 'Televite',
        html,
    })

    !__prod__ && console.log(getTestMessageUrl(info))
}
