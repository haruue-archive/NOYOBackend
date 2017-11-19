
export class SMS {
  mobile: number;
  message: string;
}

export class SentEmailInfo {
  sms: SMS
}

export async function sendSMS(sms: SMS): Promise<SentEmailInfo> {
  // TODO: find a free sms platform and send real sms
  console.log(`[WARN] no real SMS will be sent, please config a real sms service in util/mobile-helper.ts`);
  console.log(`[SMS] content: ${sms.message}`);
  return { sms: sms }
}