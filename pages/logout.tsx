import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuth0 } from 'utils/with-auth0';

function Logout() {
  const { logout } = useAuth0();
  useEffect(() => {
    logout();
  }, []);
  return <div>Loading...</div>;
}

export default withAuth0(Logout);
