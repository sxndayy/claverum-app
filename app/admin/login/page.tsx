import { Metadata } from 'next';
import AdminLoginClient from './AdminLoginClient';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin login",
  alternates: {
    canonical: `${SITE_URL}/admin/login`,
  },
  robots: 'noindex, follow',
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
