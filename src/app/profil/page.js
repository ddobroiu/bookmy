import ProfileClientPage from './ProfileClientPage';
import { getSession } from '../../lib/session';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  // In a real application, you would fetch user data here
  // For now, we'll pass a placeholder or fetch it client-side
  const userData = {
    id: session.userId,
    name: session.userName || 'N/A',
    email: session.userEmail || 'N/A',
    phoneNumber: session.userPhoneNumber || '', // Assuming phoneNumber might be in session
    role: session.userRole || 'CLIENT',
  };

  return <ProfileClientPage initialUserData={userData} />;
}
