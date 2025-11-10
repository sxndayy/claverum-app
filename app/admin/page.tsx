import { Metadata } from 'next';
import AdminClient from './AdminClient';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard",
  alternates: {
    canonical: `${SITE_URL}/admin`,
  },
  robots: 'noindex, follow',
};

export default function AdminPage() {
  return <AdminClient />;
}

