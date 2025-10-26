#!/usr/bin/env node

/**
 * Secure Password Hash Generator for Claverum Admin Users
 * This script generates bcrypt hashes for your chosen passwords
 */

import bcrypt from 'bcrypt';
import crypto from 'crypto';

async function generateSecureHashes() {
  console.log('🔐 Claverum Admin Password Hash Generator');
  console.log('==========================================\n');
  
  console.log('This script will generate secure bcrypt hashes for your admin passwords.');
  console.log('You can set your own passwords and get the hashes for Railway deployment.\n');

  try {
    // Generate JWT secret (256-bit)
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    
    console.log('📋 STEP 1: Set your admin credentials');
    console.log('=====================================\n');
    
    // Example credentials - you can change these
    const admin1 = {
      username: 'admin',
      password: 'Claverum2024!'
    };
    
    const admin2 = {
      username: 'manager', 
      password: 'SecurePass123!'
    };
    
    console.log('Example Admin User 1:');
    console.log(`Username: ${admin1.username}`);
    console.log(`Password: ${admin1.password}`);
    console.log('');
    
    console.log('Example Admin User 2:');
    console.log(`Username: ${admin2.username}`);
    console.log(`Password: ${admin2.password}`);
    console.log('');
    
    console.log('⚠️  IMPORTANT: Change these passwords to your own secure passwords!');
    console.log('Edit this script and replace the username/password values above.\n');
    
    console.log('⏳ Generating password hashes...\n');

    // Generate bcrypt hashes (12 rounds for security)
    const saltRounds = 12;
    const hash1 = await bcrypt.hash(admin1.password, saltRounds);
    const hash2 = await bcrypt.hash(admin2.password, saltRounds);

    console.log('✅ Password hashes generated successfully!\n');
    console.log('📋 Environment Variables for Railway:');
    console.log('=====================================');
    console.log(`JWT_SECRET=${jwtSecret}`);
    console.log(`JWT_EXPIRES_IN=24h`);
    console.log(`JWT_REFRESH_EXPIRES_IN=7d`);
    console.log(`ADMIN_USER_1_USERNAME=${admin1.username}`);
    console.log(`ADMIN_USER_1_PASSWORD_HASH=${hash1}`);
    console.log(`ADMIN_USER_2_USERNAME=${admin2.username}`);
    console.log(`ADMIN_USER_2_PASSWORD_HASH=${hash2}`);
    
    console.log('\n🔒 Security Features:');
    console.log('- Passwords are hashed with bcrypt (12 rounds)');
    console.log('- JWT tokens expire after 24 hours');
    console.log('- All admin endpoints require authentication');
    console.log('- Rate limiting prevents brute force attacks');
    console.log('- SQL injection protection enabled');
    console.log('- File upload validation active');
    
    console.log('\n📝 Next Steps:');
    console.log('1. Copy the environment variables above');
    console.log('2. Add them to your Railway project settings');
    console.log('3. Redeploy your backend');
    console.log('4. Test login at /admin/login');

  } catch (error) {
    console.error('❌ Error generating password hashes:', error);
  }
}

// Run the generator
generateSecureHashes();
