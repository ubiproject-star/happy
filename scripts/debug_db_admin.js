
import { createClient } from '@supabase/supabase-js';

// Credentials provided/authorized by user
const SUPABASE_URL = 'https://shwpblroitsxezihnaut.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNod3BibHJvaXRzeGV6aWhuYXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU4NTkyNiwiZXhwIjoyMDg1MTYxOTI2fQ.0BsRuXRQURc1WDeU-7Wbm6MXJMxFXGhHu66HnxAe7ho';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function runAdminTask() {
    console.log("--- STARTING ADMIN DB CHECK ---");

    const TEST_ID = 999999999;

    // 1. Try to UPSERT a test user (Simulating what the Edge Function does)
    console.log("Attempting Administrative Upsert...");
    const { data: upsertData, error: upsertError } = await supabase
        .from('users')
        .upsert({
            id: TEST_ID,
            username: 'admin_test_bot',
            first_name: 'Admin Test',
            photo_url: 'https://via.placeholder.com/150',
            coins: 999,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (upsertError) {
        console.error("❌ UPSERT FAILED:", upsertError);
    } else {
        console.log("✅ UPSERT SUCCESS:", upsertData);
    }

    // 2. Try to SELECT (Verify Persistence)
    console.log("\nVerifying Persistence...");
    const { data: selectData, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('id', TEST_ID)
        .single();

    if (selectError) {
        console.error("❌ SELECT FAILED:", selectError);
    } else {
        console.log("✅ SELECT SUCCESS:", selectData);
    }

    // 3. List all users (to see if previous ones exist but are hidden?)
    console.log("\nListing All Users (Limit 5)...");
    const { data: allUsers, error: listError } = await supabase
        .from('users')
        .select('id, username, created_at')
        .limit(5);

    if (listError) {
        console.error("❌ LIST FAILED:", listError);
    } else {
        console.table(allUsers);
        console.log(`Total Users Found: ${allUsers?.length}`);
    }

    console.log("--- ADMIN CHECK COMPLETE ---");
}

runAdminTask();
