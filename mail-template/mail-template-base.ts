export abstract class MailTemplate {

  abstract async subject(): Promise<string>;
  abstract async text(): Promise<string>;
  abstract async html(): Promise<string>;

  protected get placeholders(): any {
    return {}
  }

  format(origin: string): string {
    for (let k in this.placeholders) {
      // noinspection JSUnfilteredForInLoop
      let v = this.placeholders[k];
      // noinspection JSUnfilteredForInLoop
      origin = origin.replace(new RegExp(k, "g"), v);
    }
    return origin;
  }

}
