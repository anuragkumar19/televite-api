export const genOtp = () => {
    return Math.floor(Math.random() * (9999- 1000)) + 1000
}