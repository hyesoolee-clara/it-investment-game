exports.handler = async () => {
  const clean = (value) => {
    const trimmed = String(value || "").trim();
    return trimmed.replace(/^["']|["']$/g, "");
  };

  const config = {
    apiKey: clean(process.env.FIREBASE_API_KEY),
    authDomain: clean(process.env.FIREBASE_AUTH_DOMAIN),
    databaseURL: clean(process.env.FIREBASE_DATABASE_URL),
    projectId: clean(process.env.FIREBASE_PROJECT_ID),
    storageBucket: clean(process.env.FIREBASE_STORAGE_BUCKET),
    messagingSenderId: clean(process.env.FIREBASE_MESSAGING_SENDER_ID),
    appId: clean(process.env.FIREBASE_APP_ID)
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Missing Firebase config: ${missing.join(", ")}` })
    };
  }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(config)
  };
};
