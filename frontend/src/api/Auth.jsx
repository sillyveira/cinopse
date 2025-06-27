const googleClientId = '499709927410-8a453sao7cas3vjjkqo4fk7c4b6dlat6.apps.googleusercontent.com';

export default function handleLogin() {
  const redirectUri = 'http://localhost:3000/auth/google/callback';
  const scope = 'openid email profile';
  const responseType = 'code';

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

  window.location.href = authUrl;
};

