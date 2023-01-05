"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_generator_1 = __importDefault(require("otp-generator"));
const Otp_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Otp"));
const Encryption_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Encryption"));
const OtpValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/OtpValidator"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const VerificationValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/VerificationValidator"));
class OtpsController {
    AddMinutesToDate(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
    async sendMailOtp({ request, response }) {
        try {
            const payload = await request.validate(OtpValidator_1.default);
            const otp = otp_generator_1.default.generate(6, {
                alphabets: false,
                upperCase: false,
                specialChars: false,
            });
            const now = new Date();
            const expirationTime = this.AddMinutesToDate(now, 10);
            const otpInstance = await Otp_1.default.create({
                otp: otp,
                expiration_time: expirationTime,
            });
            const details = {
                timestamp: now,
                email: payload.email,
                success: true,
                message: 'OTP sent to user',
                otp_id: otpInstance.id,
            };
            const encoded = Encryption_1.default.encrypt(JSON.stringify(details));
            await Mail_1.default.send((message) => {
                message
                    .from('serviceotp4@gmail.com')
                    .to(payload.email)
                    .subject('OTP Code')
                    .text('Your OTP code for login: ' + otp);
            });
            return response.send({ Status: 'Success', Details: encoded });
        }
        catch (error) {
            response.json({
                message: 'Sending OTP failed by error',
                error: `${error.message}`,
            });
        }
    }
    async verifyEmailOtp({ request, response }) {
        try {
            const payload = await request.validate(VerificationValidator_1.default);
            const currentDate = this.AddMinutesToDate((new Date()), 10);
            const decoded = Encryption_1.default.decrypt(payload.verification_key);
            const obj = JSON.parse(decoded);
            const otp_instance = await Otp_1.default.find(obj.otp_id);
            if (payload.email != obj.email)
                throw new Error("OTP was not sent to this particular email");
            if (otp_instance && otp_instance.verified !== true && currentDate >= otp_instance.expiration_time && payload.otp == otp_instance.otp) {
                otp_instance.verified = true;
                otp_instance.save();
            }
            else {
                throw new Error('OTP verify request failed.');
            }
            response.status(200);
            return response.send({
                "Status": "Success",
                "Details": "OTP Matched"
            });
        }
        catch (error) {
            response.json({
                message: 'Verification OTP failed by error',
                error: `${error.message}`,
            });
        }
    }
}
exports.default = OtpsController;
//# sourceMappingURL=OtpsController.js.map