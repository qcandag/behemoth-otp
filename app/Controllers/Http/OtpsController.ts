// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import otpGenerator from 'otp-generator'
import Otp from 'App/Models/Otp'
import Encryption from '@ioc:Adonis/Core/Encryption'
import OtpValidator from 'App/Validators/OtpValidator'
import Mail from '@ioc:Adonis/Addons/Mail'
import VerificationValidator from 'App/Validators/VerificationValidator'
// import botFather ? 5897560538:AAGrcZQHLudYf-Iq-AszRZ0XMpQcJZMAyQI
export default class OtpsController {
  private AddMinutesToDate(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000)
  }

  public async sendMailOtp({ request, response }) {
    try {
      const payload = await request.validate(OtpValidator)
      const otp = otpGenerator.generate(6, {
        alphabets: false,
        upperCase: false,
        specialChars: false,
      })
      const now = new Date()
      const expirationTime = this.AddMinutesToDate(now, 10)
      const otpInstance = await Otp.create({
        otp: otp,
        expiration_time: expirationTime,
      })

      const details = {
        timestamp: now,
        email: payload.email,
        success: true,
        message: 'OTP sent to user',
        otp_id: otpInstance.id,
      }

      const encoded = Encryption.encrypt(JSON.stringify(details))
      await Mail.send((message) => {
        message
          .from('serviceotp4@gmail.com')
          .to(payload.email)
          .subject('OTP Code')
          .text('Your OTP code for login: ' + otp)
      }).catch((err)=>{
        return response.status(400).json({
          message: 'Error occured',
        })
      })

      return response.send({ Status: 'Success', Details: encoded })
    } catch (error) {
      response.status(400).json({
        message: 'Format Error',
        errors: error.messages.errors.map((err) => err.message)
      })
    }
  }

  public async verifyEmailOtp({ request, response }) {
    try {
      const payload = await request.validate(VerificationValidator)
      const currentDate = this.AddMinutesToDate(new Date(), 10)
      const decoded = Encryption.decrypt(payload.verification_key)
      const obj = JSON.parse(decoded)

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const otp_instance = await Otp.find(obj.otp_id)
      // throw new Error()
      if (!otp_instance || payload.email !== obj.email || !(payload.otp === otp_instance.otp)) {
        return response.status(403).json({
          ERR_CODE: 403,
          message: 'OTP was not sent to this particular email',
        })
      } else if (currentDate < otp_instance.expiration_time) {
        return response.status(403).json({
          ERR_CODE: 403,
          message: 'This OTP has expired.',
        })
      } else if (otp_instance.verified) {
        return response.status(403).json({
          ERR_CODE: 403,
          message: 'This OTP has already been verified.',
        })
      } else {
        otp_instance.verified = true
        otp_instance.save()
        return response.status(200).json({
          Status: 'Success',
          Details: 'OTP Matched',
        })
      }
    } catch (error) {
      response.status(400).json({
        message: 'Format error',
        errors: error.messages.errors.map((err) => err.message),
      })
    }
  }
}
