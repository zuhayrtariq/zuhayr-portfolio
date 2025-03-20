
import { NewMessageEmail } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req: Request) {

    const formData = await req.formData();
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const message = formData.get('message') as string
    try {
        const { data, error } = await resend.emails.send({
            from: `${name} <zuhayr@resend.dev>`,
            to: ['zuhayrtariq4@gmail.com'],
            subject: 'New Mail From Portfolio',
            react: NewMessageEmail(
                {
                    name,
                    email,
                    phone,
                    message,

                }
            ),
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}