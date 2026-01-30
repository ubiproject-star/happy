
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code is designed for Supabase Edge Functions.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encode as hexEncode } from "https://deno.land/std@0.177.0/encoding/hex.ts";
import * as djwt from "https://deno.land/x/djwt@v2.8/mod.ts";

const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    try {
        const { initData } = await req.json();

        if (!initData) {
            throw new Error("No initData provided");
        }

        // 1. Validate Telegram Data
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');

        // Sort keys alphabetically
        const dataCheckString = Array.from(urlParams.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([key, val]) => `${key}=${val}`)
            .join('\n');

        // Create Secret Key (HMAC-SHA-256 of Bot Token)
        const encoder = new TextEncoder();
        const secretKey = await crypto.subtle.importKey(
            "raw",
            encoder.encode("WebAppData"),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const secretKeySignature = await crypto.subtle.sign("HMAC", secretKey, encoder.encode(botToken));

        // Calculate Hash (HMAC-SHA-256 of dataCheckString using Secret Key)
        const calculationKey = await crypto.subtle.importKey(
            "raw",
            secretKeySignature,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const calculatedHashBuffer = await crypto.subtle.sign("HMAC", calculationKey, encoder.encode(dataCheckString));
        const calculatedHash = new TextDecoder().decode(hexEncode(new Uint8Array(calculatedHashBuffer)));

        if (calculatedHash !== hash) {
            throw new Error("Invalid Telegram Signature");
        }

        // 2. Extract User Data
        const userData = JSON.parse(urlParams.get('user')!);
        const { id, first_name, last_name, username, photo_url, language_code } = userData;

        // 3. Upsert User in Database
        const { data: user, error: dbError } = await supabase
            .from('users')
            .upsert({
                id,
                first_name,
                last_name,
                username,
                photo_url,
                language_code,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (dbError) throw dbError;

        // 4. Create Custom JWT (Optional, or just use user ID for RLS if signed)
        /* 
           To make this truly secure with Supabase RLS, we should mint a JWT signed with Supabase's JWT Secret.
           For now, we return the user object. The frontend can use the 'id' for basic logic, 
           but for RLS, Supabase expects a JWT.
        */

        const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET') || 'super-secret-jwt-token-with-at-least-32-characters-long';

        // Create a payload that mimics Supabase Auth
        // This allows RLS policies using `auth.uid()` to work!
        const payload = {
            aud: "authenticated",
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
            sub: id.toString(),
            email: `${id}@telegram.user`,
            role: "authenticated",
            app_metadata: {
                provider: "telegram",
                providers: ["telegram"]
            },
            user_metadata: {
                username,
                first_name
            }
        };

        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            encoder.encode(jwtSecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const token = await djwt.create({ alg: "HS256", typ: "JWT" }, payload, cryptoKey);

        return new Response(
            JSON.stringify({ user, token }),
            { headers: { "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        )
    }
})
