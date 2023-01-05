"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/', async () => {
    return { hello: 'Welcome to OTP api :)' };
});
Route_1.default.post('/send/email/otp', 'OtpsController.sendMailOtp');
Route_1.default.post('/verify/email/otp', 'OtpsController.verifyEmailOtp');
//# sourceMappingURL=routes.js.map