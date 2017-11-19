import {EmailVerifyMailTemplate} from "./email-verify/index";
import {MailTemplate} from "./mail-template-base";

export class MailTemplates {
  static findByOp(op: string): MailTemplate | undefined {
    return MailTemplates.TEMPLATES[op];
  }
  /**
   * Key must be one of {@link OPS}
   * @type {{verifyEmail: EmailVerifyMailTemplate}}
   */
  private static TEMPLATES = {
    "verifyEmail": new EmailVerifyMailTemplate()
  };

}
