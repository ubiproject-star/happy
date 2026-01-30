
import { createClient } from '@supabase/supabase-js';

// Credentials from bug10.txt / verified previously
const SUPABASE_URL = 'https://shwpblroitsxezihnaut.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNod3BibHJvaXRzeGV6aWhuYXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU4NTkyNiwiZXhwIjoyMDg1MTYxOTI2fQ.0BsRuXRQURc1WDeU-7Wbm6MXJMxFXGhHu66HnxAe7ho';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function runAuthCheck() {
    console.log("--- STARTING AUTH ADMIN DEBUG ---");

    const TEST_EMAIL = "debug_admin_user@telegram.happi.app";
    const TEST_PASS = "password123";

    console.log(`Attempting to create user: ${TEST_EMAIL}`);

    // 1. Try Admin Create User (Bypasses "Confirm Email" usually)
    const { data, error } = await supabase.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASS,
        email_confirm: true // Force confirm
    });

    if (error) {
        console.error("❌ ADMIN CREATE FAILED:", error);
    } else {
        console.log("✅ ADMIN CREATE SUCCESS:", data.user?.id);
        console.log("   User should now be visible in Dashboard.");
    }

    // 2. List Users to verify
    console.log("\nListing Auth Users...");
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("❌ LIST USERS FAILED:", listError);
    } else {
        console.log(`✅ Total Users Found: ${users.length}`);
        users.forEach(u => console.log(`   - ${u.email} (${u.id})`));
    }

    console.log("--- DEBUG COMPLETE ---");
}

runAuthCheck();
