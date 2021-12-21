import { useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Router from 'next/router';

export function onAuth0RedirectCallback(appState) {
  const { returnTo } = appState || {};

  // https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-error-invalid-state-in-firefox-when-refreshing-the-page-immediately-after-a-login
  // eslint-disable-next-line no-self-assign
  window.location.hash = window.location.hash;

  Router.replace(returnTo || '/dashboard');
}

// This stuff is basically taken straight from @auth0/auth0-react. However,
// this package is defaulting to an empty object [here](https://github.com/auth0/auth0-react/blob/9a15c540fee6d53514eaaea77cbadfb767b14891/src/with-authentication-required.tsx#L87)
// and this is causing, for some reason, the useEffect [here](https://github.com/auth0/auth0-react/blob/9a15c540fee6d53514eaaea77cbadfb767b14891/src/with-authentication-required.tsx#L109)
// to be invoked twice and loginWithRedirect() is invoked twice. This sometimes
// leads to a mismatch b/w code_verifier and code_challenge when logging in.
// This is the likely cause of our intermittent/inconsistent login issues as
// reported by our users.
//
// We've copy/pasted withAuthenticationRequired from @auth0/auth0-react and
// modified the loginOptions default to be a previously defined `const` empty
// object, which seems to prevent a duplicate useEffect invocation since we're
// not creating a new instance of the object.
//
// We will file a GitHub about this in the [@auth0/auth0-react repo](https://github.com/auth0/auth0-react/issues).
const defaultOnRedirecting = (): JSX.Element => <></>;
const defaultReturnTo = (): string =>
  `${window.location.pathname}${window.location.search}`;
type LoginOptions = {
  redirectUri?: string;
  appState?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  fragment?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyObject = {} as LoginOptions;

const withAuthenticationRequired = (
  Component: React.ComponentType,
  options: {
    returnTo?: string | (() => string);
    onRedirecting?: () => JSX.Element;
    loginOptions?: LoginOptions;
    claimCheck?: (claims?: { [key: string]: any }) => boolean;
  },
) => {
  return function WithAuthenticationRequired(props) {
    const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const {
      returnTo = defaultReturnTo,
      onRedirecting = defaultOnRedirecting,
      claimCheck = (): boolean => true,

      // This is how it currently is in @auth0/auth0-react, but leads to
      // multiple invocations of loginWithRedirect() in the case of multiple
      // renders.
      loginOptions = {},

      // Using a const prevents multiple invocations of loginWithRedirect().
      // loginOptions = emptyObject,
    } = options;

    const routeIsAuthenticated = isAuthenticated && claimCheck(user);

    useEffect(() => {
      if (isLoading || routeIsAuthenticated) {
        return;
      }
      const opts = {
        ...loginOptions,
        appState: {
          ...loginOptions.appState,
          returnTo: typeof returnTo === 'function' ? returnTo() : returnTo,
        },
      };
      (async (): Promise<void> => {
        // eslint-disable-next-line no-console
        console.log('loginWithRedirect() invoked!');
        await loginWithRedirect(opts);
      })();
    }, [
      isLoading,
      routeIsAuthenticated,
      loginWithRedirect,
      loginOptions,
      returnTo,
    ]);

    return routeIsAuthenticated ? <Component {...props} /> : onRedirecting();
  };
};

export function withAuth0(Component) {
  Component = withAuthenticationRequired(Component, {
    onRedirecting: () => <div>Loading...</div>,
  });

  const redirectUri = `${process.env.NEXT_PUBLIC_ODESLI_ORIGIN}/return`;

  function Auth0WrappedComponent(props) {
    return (
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
        redirectUri={redirectUri}
        onRedirectCallback={onAuth0RedirectCallback}
        audience={process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}
        scope={'openid profile email'}
        {...(process.env.NEXT_PUBLIC_DEPLOY_ENV === 'local'
          ? {
              useRefreshTokens: true,
              cacheLocation: 'localstorage',
            }
          : {})}
      >
        <Component {...props} />
      </Auth0Provider>
    );
  }

  return Auth0WrappedComponent;
}
