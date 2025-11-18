import ProfileClientPage from './ProfileClientPage';
import { getSession } from '../../lib/session';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  let userData = null;
  try {
    const response = await fetch('http://localhost:3000/api/user/profile', {
      cache: 'no-store'
    });

    if (!response.ok) {
      redirect('/login');
    }
    userData = await response.json();
  } catch (error) {
    redirect('/login');
  }

  return <ProfileClientPage initialUserData={userData} />;
}
