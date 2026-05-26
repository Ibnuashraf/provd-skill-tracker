import { AuthService } from './AuthService';

/**
 * Supabase Integration Test
 * Run this to verify your Supabase setup
 */

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...\n');

  try {
    // Check if using Supabase
    const isLocal = AuthService.isLocalAuth();
    console.log(`📍 Auth Mode: ${isLocal ? 'LOCAL (localStorage)' : 'SUPABASE (Cloud)'}`);

    if (isLocal) {
      console.warn('\n⚠️  Using local auth. Supabase credentials may not be configured.');
      console.log('To use Supabase:');
      console.log('1. Update .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_KEY');
      console.log('2. Run SUPABASE_SETUP.sql in your Supabase SQL editor');
      console.log('3. Restart dev server\n');
      return false;
    }

    console.log('✅ Supabase credentials found\n');

    // Test 1: Sign up
    console.log('Test 1️⃣ : Sign Up');
    const testEmail = `test_${Date.now()}@provd.local`;
    const { error: signupError, data: signupData } = await AuthService.signUp(
      testEmail,
      'TestPassword123',
      'Test User'
    );

    if (signupError) {
      console.error('❌ Sign up failed:', signupError.message);
      return false;
    }
    console.log('✅ Sign up successful');
    console.log('   User ID:', signupData.user?.id);
    console.log('   Email:', signupData.user?.email, '\n');

    // Test 2: Sign in
    console.log('Test 2️⃣ : Sign In');
    const { error: signinError, data: signinData } = await AuthService.signIn(
      testEmail,
      'TestPassword123'
    );

    if (signinError) {
      console.error('❌ Sign in failed:', signinError.message);
      return false;
    }
    console.log('✅ Sign in successful');
    console.log('   User ID:', signinData.user?.id, '\n');

    // Test 3: Store data
    console.log('Test 3️⃣ : Store User Data');
    const testData = {
      skills: ['React', 'Node.js'],
      streak: 5,
      totalPoints: 150
    };

    const { error: storeError } = await AuthService.storeUserData(
      signupData.user.id,
      testData
    );

    if (storeError) {
      console.error('❌ Store data failed:', storeError.message);
      return false;
    }
    console.log('✅ Data stored successfully\n');

    // Test 4: Retrieve data
    console.log('Test 4️⃣ : Retrieve User Data');
    const { data: retrievedData, error: retrieveError } = await AuthService.getUserData(
      signupData.user.id
    );

    if (retrieveError) {
      console.error('❌ Retrieve data failed:', retrieveError.message);
      return false;
    }
    console.log('✅ Data retrieved successfully');
    console.log('   Retrieved Data:', retrievedData, '\n');

    // Test 5: Sign out
    console.log('Test 5️⃣ : Sign Out');
    const { error: signoutError } = await AuthService.signOut();

    if (signoutError) {
      console.error('❌ Sign out failed:', signoutError.message);
      return false;
    }
    console.log('✅ Sign out successful\n');

    console.log('═══════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════');
    console.log('\nYour Supabase integration is working correctly! 🎉\n');

    return true;
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.log('\nDebugging tips:');
    console.log('1. Check browser console for detailed errors');
    console.log('2. Verify .env.local has correct credentials');
    console.log('3. Ensure SUPABASE_SETUP.sql was run');
    console.log('4. Check Supabase project is active\n');
    return false;
  }
}

/**
 * How to use:
 * 
 * In your browser console:
 * import { testSupabaseConnection } from './src/SupabaseTest';
 * await testSupabaseConnection();
 * 
 * Or in a React component:
 * import { useEffect } from 'react';
 * import { testSupabaseConnection } from './SupabaseTest';
 * 
 * export function TestComponent() {
 *   useEffect(() => {
 *     testSupabaseConnection();
 *   }, []);
 *   return <div>Check console for results</div>;
 * }
 */
