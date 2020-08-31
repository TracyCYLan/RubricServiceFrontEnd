import React from 'react';
import { AuthProvider } from 'oidc-react';

const oidcConfig = {
  onSignIn: async (user: any) => {
    alert('Logged in successfully');
    console.log(user);
    window.location.hash = '';
  },
  authority: 'https://identity.cysun.org',
  clientId: 'alice-rubric-service-dev',
  responseType: 'code',
  redirectUri: 'http://localhost:3000/auth'
};

function OIDCHandler() {
  return (
    <AuthProvider {...oidcConfig}>
      <div className="App">
        <header className="App-header">
          <p>Redirect to OIDC Log in</p>
        </header>
      </div>
     </AuthProvider>
  );
}

export default OIDCHandler;
