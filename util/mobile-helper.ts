export function sendSMS(message: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // TODO: find a free sms platform and send real sms
    console.log(`[WARN] no real SMS will be sent, please config a real sms service in util/mobile-helper.ts`);
    console.log(`[SMS] content: ${message}`);
    resolve(true);
  });
}