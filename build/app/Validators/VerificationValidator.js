"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class VerificationValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            otp: Validator_1.schema.string({}, [Validator_1.rules.maxLength(6), Validator_1.rules.minLength(6)]),
            verification_key: Validator_1.schema.string(),
            email: Validator_1.schema.string()
        });
        this.messages = {};
    }
}
exports.default = VerificationValidator;
//# sourceMappingURL=VerificationValidator.js.map