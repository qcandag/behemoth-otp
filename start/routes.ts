import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'Welcome to OTP api :)' }
})

Route.post('/send/email/otp', 'OtpsController.sendMailOtp') // Validator for phone number
Route.post('/verify/email/otp', 'OtpsController.verifyEmailOtp')
