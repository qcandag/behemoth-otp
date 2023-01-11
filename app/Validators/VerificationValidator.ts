import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerificationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    otp: schema.string({}, [rules.required(), rules.maxLength(6), rules.minLength(6)]),
    verification_key: schema.string({}, [rules.required()]),
    email: schema.string({}, [rules.required(), rules.email()]),
  })

  public messages = {
    'otp.maxLength': 'Otp should be length of {{options.maxLength}}',
    'otp.minLength': 'Otp should be length of {{options.minLength}}',
    'required': 'The {{ field }} is required',
    'email.email': 'This e mail is not valid',
  }
}
