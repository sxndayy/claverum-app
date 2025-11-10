import { Metadata } from 'next';
import AdminLoginClient from './AdminLoginClient';

// SEO irrelevant - noindex, no canonical needed

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin login",
  robots: 'noindex, nofollow',
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
