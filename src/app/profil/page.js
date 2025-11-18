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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile`, {
      headers: {
        'Cookie': `session=${session.sessionToken}` // Pass session token for authentication
      },
      cache: 'no-store' // Ensure fresh data
    });

    if (!response.ok) {
      // Handle cases where the user might not be found or other API errors
      console.error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
      // Optionally redirect to an error page or show a message
      redirect('/login'); // Redirect to login if profile fetch fails
    }

    userData = await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    redirect('/login'); // Redirect to login on network error
  }

  return <ProfileClientPage initialUserData={userData} />;
}
