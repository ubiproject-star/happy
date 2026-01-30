
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://shwpblroitsxezihnaut.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNod3BibHJvaXRzeGV6aWhuYXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU4NTkyNiwiZXhwIjoyMDg1MTYxOTI2fQ.0BsRuXRQURc1WDeU-7Wbm6MXJMxFXGhHu66HnxAe7ho';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function checkData() {
    console.log("--- DIAGNOSTIC: CHECKING USER DATA ---");

    // 1. List Auth Users
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error("Auth List Error:", authError);
        return;
    }

    console.log(`\nFound ${authUsers.length} Auth Users:`);
    authUsers.forEach(u => console.log(`- AuthID: ${u.id} | Email: ${u.email}`));

    // 2. List Public Profile Users
    const { data: dbUsers, error: dbError } = await supabase.from('users').select('*');

    if (dbError) {
        console.error("Public DB Error:", dbError);
        return;
    }

    console.log(`\nFound ${dbUsers.length} Public Profiles:`);
    dbUsers.forEach(u => console.log(`- ID: ${u.id} | Name: ${u.first_name || 'NULL'} | Coins: ${u.coins}`));

    // 3. Match Analysis
    console.log("\n--- ANALYSIS ---");
    authUsers.forEach(au => {
        // Extract TelegramID from email (12345@telegram...)
        const tgId = au.email.split('@')[0];
        const match = dbUsers.find(du => String(du.id) === tgId);

        if (match) {
            console.log(`✅ User ${tgId}: Synced (Coins: ${match.coins})`);
        } else {
            console.log(`❌ User ${tgId}: MISSING PUBLIC PROFILE!`);
        }
    });
}

checkData();
