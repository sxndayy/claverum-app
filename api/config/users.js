// Admin users configuration
// Passwords are bcrypt hashed and stored in environment variables

export const users = [
  {
    username: process.env.ADMIN_USER_1_USERNAME || 'admin1',
    passwordHash: process.env.ADMIN_USER_1_PASSWORD_HASH || '',
    role: 'admin'
  },
  {
    username: process.env.ADMIN_USER_2_USERNAME || 'admin2', 
    passwordHash: process.env.ADMIN_USER_2_PASSWORD_HASH || '',
    role: 'admin'
  }
];

// Validate that all users have password hashes
export function validateUsers() {
  const missingHashes = users.filter(user => !user.passwordHash);
  
  if (missingHashes.length > 0) {
    console.error('Missing password hashes for users:', missingHashes.map(u => u.username));
    throw new Error('All admin users must have password hashes configured');
  }
  
  console.log(`✅ ${users.length} admin users configured`);
}
