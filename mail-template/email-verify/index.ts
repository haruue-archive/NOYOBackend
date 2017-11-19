import {websiteFullName, websiteBaseUrl, websiteName} from "../../config";
import * as fs from "async-file";
import {backendBaseUrl} from "../../config";
import {MailTemplate} from "../mail-template-base";

export class EmailVerifyMailTemplate extends MailTemplate {

  async subject(): Promise<string> {
    return `${websiteName} - 邮箱地址验证`;
  }

  async text(): Promise<string> {
    let text = await fs.readFile(__dirname + '/../res/email-verify.txt', 'utf8');
    text = this.format(text);
    return text;
  }

  async html(): Promise<string> {
    let text = await fs.readFile(__dirname + '/../res/email-verify.html', 'utf8');
    text = this.format(text);
    return text;
  }

  protected get placeholders(): any {
    return {
      "%year": new Date().getFullYear(),
      "%websiteName": websiteName,
      "%websiteFullName": websiteFullName,
      "%websiteHomePageUrl": websiteBaseUrl,
      "%validate_link": backendBaseUrl + "/v1/account/verify/email?uid=%uid&op=%op&token=%token"
    };
  }
}