const admin = require("firebase-admin");

function getServiceAccount() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured.");
  }
  return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
}

function getAdminApp() {
  if (admin.apps.length) return admin.app();
  return admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount()),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

function cleanPassword(value) {
  return String(value || "").trim();
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { password } = JSON.parse(event.body || "{}");
    const submittedPassword = cleanPassword(password);
    const configuredPassword = cleanPassword(process.env.INSTRUCTOR_PASSWORD);

    if (!configuredPassword) {
      return { statusCode: 500, body: JSON.stringify({ error: "Instructor password is not configured." }) };
    }

    if (submittedPassword !== configuredPassword) {
      console.warn("Instructor password mismatch", {
        submittedLength: submittedPassword.length,
        configuredLength: configuredPassword.length
      });
      return { statusCode: 401, body: JSON.stringify({ error: "Password mismatch. Check INSTRUCTOR_PASSWORD in Netlify and redeploy." }) };
    }

    getAdminApp();
    const token = await admin.auth().createCustomToken("instructor", { role: "instructor" });

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Login failed." })
    };
  }
};
