import React from 'react';
import { AuthProvider } from 'oidc-react';

const oidcConfig = {
  onSignIn: async (user: any) => {
    alert('Logged in successfully');
    console.log(user);
    window.location.hash = '';
  },
  authority: 'https://accounts.google.com',
  clientId:
    '1066073673387-undfdseanu1soilcdprq1p4m8gq8a1iu.apps.googleusercontent.com',
  responseType: 'id_token',
  redirectUri: 'http://localhost:3000/'
};

function OIDCRedirectComponent() {
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

export default OIDCRedirectComponent;
