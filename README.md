**Re: https://github.com/auth0/auth0-react/issues/309**

Install dependencies:

```sh
npm install
```

To start the app in development mode:

```sh
npm run dev
```

App will be accessible at http://localhost:1302.

To reproduce issue:

1. Open browser and dev tools console.
1. Go to http://localhost:1302/login.
1. Check console for log `loginWithRedirect() invoked!`. There will be two of them. See comments in `utils/with-auth0.tsx` and [GitHub issue](https://github.com/auth0/auth0-react/issues/309) for how to fix issue.
