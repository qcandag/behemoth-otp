import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OtpValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email()]),
  })

  public messages: CustomMessages = {
    'required': 'The {{ field }} is required',
    'email.email': 'This e mail is not valid',
  }
}
