import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerificationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    otp: schema.string({}, [rules.maxLength(6), rules.minLength(6)]),
    verification_key: schema.string(),
    email: schema.string()
  })

  public messages: CustomMessages = {}
}
