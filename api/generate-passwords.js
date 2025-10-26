#!/usr/bin/env node

/**
 * Password Hash Generator
 * Generates bcrypt hashes for admin user passwords
 */

import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function generatePasswordHash() {
  console.log('🔐 Claverum Admin Password Hash Generator');
  console.log('==========================================\n');

  try {
    // Get first admin user credentials
    console.log('Admin User 1:');
    const username1 = await question('Username: ');
    const password1 = await question('Password: ');
    
    console.log('\nAdmin User 2:');
    const username2 = await question('Username: ');
    const password2 = await question('Password: ');

    console.log('\n⏳ Generating password hashes...\n');

    // Generate bcrypt hashes (12 rounds)
    const saltRounds = 12;
    const hash1 = await bcrypt.hash(password1, saltRounds);
    const hash2 = await bcrypt.hash(password2, saltRounds);

    // Generate JWT secret (256-bit)
    const jwtSecret = require('crypto').randomBytes(32).toString('hex');

    console.log('✅ Password hashes generated successfully!\n');
    console.log('📋 Environment Variables for Railway:');
    console.log('=====================================');
    console.log(`JWT_SECRET=${jwtSecret}`);
    console.log(`JWT_EXPIRES_IN=24h`);
    console.log(`JWT_REFRESH_EXPIRES_IN=7d`);
    console.log(`ADMIN_USER_1_USERNAME=${username1}`);
    console.log(`ADMIN_USER_1_PASSWORD_HASH=${hash1}`);
    console.log(`ADMIN_USER_2_USERNAME=${username2}`);
    console.log(`ADMIN_USER_2_PASSWORD_HASH=${hash2}`);
    console.log('\n🔒 Security Notes:');
    console.log('- Passwords are never stored in plain text');
    console.log('- JWT tokens expire after 24 hours');
    console.log('- All admin endpoints require authentication');
    console.log('- Rate limiting is enabled for all endpoints');

  } catch (error) {
    console.error('❌ Error generating password hashes:', error);
  } finally {
    rl.close();
  }
}

// Run the generator
generatePasswordHash();
