import { useEffect, useState } from 'react';
import { withAuth0 } from 'utils/with-auth0';

function Secret() {
  const [state, setState] = useState(0);
  useEffect(() => {
    setState(state + 1);
  }, []);
  return (
    <div>{`This is secret! You are logged in. 👍 The state is ${state}.`}</div>
  );
}

export default withAuth0(Secret);
