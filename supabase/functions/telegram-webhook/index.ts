
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
    try {
        const update = await req.json();

        // 1. PRE-CHECKOUT QUERY (Must answer within 10 seconds)
        if (update.pre_checkout_query) {
            const queryId = update.pre_checkout_query.id;

            // In a real app, check stock or logic here.
            // For digital goods, we usually just approve.

            await fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pre_checkout_query_id: queryId,
                    ok: true
                })
            });

            return new Response("OK", { status: 200 });
        }

        // 2. SUCCESSFUL PAYMENT
        if (update.message && update.message.successful_payment) {
            const payment = update.message.successful_payment;
            const tgUserId = update.message.from.id; // Telegram User ID
            const chargeId = payment.telegram_payment_charge_id;
            const amount = payment.total_amount; // amount

            // Log to 'payments' table
            const { error: logError } = await supabase
                .from('payments')
                .insert({
                    user_id: tgUserId,
                    amount: amount,
                    currency: payment.currency,
                    status: 'completed',
                    telegram_payment_charge_id: chargeId
                });

            if (logError) console.error('Payment Log Error:', logError);

            // Update User Balance (Coins)
            // Assume 1 Star = 1 Coin for this example, or logic based on payload
            // Ideally payload contains package info, e.g., "pack_100_stars"

            // increment coins
            const { error: coinError } = await supabase.rpc('increment_coins', {
                row_id: tgUserId,
                amount: amount
            });

            /* 
               NOTE: 'increment_coins' RPC needs to be created in DB.
               Alternative: Fetch -> Calc -> Update (less safe for concurrency)
            */

            if (coinError) console.error('Coin Update Error:', coinError);

            return new Response("OK", { status: 200 });
        }

        return new Response("OK", { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
})
