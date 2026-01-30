
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!;

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    try {
        const { title, description, price, payload, photo_url } = await req.json();

        // Telegram Stars Currency is 'XTR'
        // Price must be an integer amount of stars

        const body = {
            title,
            description,
            payload: payload || 'custom_payload',
            currency: 'XTR',
            prices: [{ label: title, amount: parseInt(price) }], // amount in basic units
            provider_token: "", // EMPTY for Digital Goods (Stars)
            photo_url: photo_url,
        };

        const res = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!data.ok) {
            throw new Error(data.description || 'Failed to create invoice link');
        }

        return new Response(
            JSON.stringify({ result: data.result }), // Returns the link (t.me/invoice/...)
            { headers: { "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        )
    }
})
