#!/usr/bin/env node

/**
 * Simple Password Hash Generator
 * Edit the passwords below and run this script
 */

import bcrypt from 'bcrypt';
import crypto from 'crypto';

async function generateHashes() {
  console.log('🔐 Generating password hashes for Henri and Johannes...\n');

  // ============================================
  // EDIT THESE PASSWORDS TO YOUR SECURE ONES:
  // ============================================
  const henriPassword = 'HenriFlora!1!';
  const johannesPassword = 'JohannesTechno!1';
  
  try {
    // Generate JWT secret
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    
    // Generate password hashes
    const henriHash = await bcrypt.hash(henriPassword, 12);
    const johannesHash = await bcrypt.hash(johannesPassword, 12);

    console.log('✅ Hashes generated successfully!\n');
    
    console.log('📋 Copy these environment variables to Railway:');
    console.log('==============================================');
    console.log(`JWT_SECRET=${jwtSecret}`);
    console.log(`JWT_EXPIRES_IN=24h`);
    console.log(`JWT_REFRESH_EXPIRES_IN=7d`);
    console.log(`ADMIN_USER_1_USERNAME=Henri`);
    console.log(`ADMIN_USER_1_PASSWORD_HASH=${henriHash}`);
    console.log(`ADMIN_USER_2_USERNAME=Johannes`);
    console.log(`ADMIN_USER_2_PASSWORD_HASH=${johannesHash}`);
    
    console.log('\n🔒 Your passwords are now securely hashed!');
    console.log('📝 Next: Add these variables to Railway and redeploy.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateHashes();
