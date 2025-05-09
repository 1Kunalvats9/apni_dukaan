import { Twilio } from 'twilio';
import { NextResponse } from 'next/server';

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  try {
    const { phoneNumber, billDetails } = await req.json();
    const message = await client.messages.create({
      body: `🧾 Bill from ShopManager:\n${billDetails}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    });
    return NextResponse.json({ success: true, sid: message.sid }, { status: 200 });
  } catch (err) {
    console.error('❌ SMS Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
