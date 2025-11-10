import { Metadata } from 'next';
import AdminClient from './AdminClient';

// Note: Admin page is statically generated but uses client-side auth
// The AdminClient component handles all dynamic behavior client-side
// SEO irrelevant - noindex, no canonical needed

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard",
  robots: 'noindex, nofollow',
};

export default function AdminPage() {
  return <AdminClient />;
}

