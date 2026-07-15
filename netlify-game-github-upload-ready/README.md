# Platform IT Investment Game

Static classroom game with Firebase Realtime Database sync and Netlify Functions for instructor login.

## Why Netlify Functions are included

The instructor password must not live in `index.html`. Browser code is public by design. The password is checked in `netlify/functions/instructor-login.js` against `process.env.INSTRUCTOR_PASSWORD`, then the function returns a Firebase custom token with `role: "instructor"`.

Students use Firebase anonymous auth, so database rules can allow each student to write only their own nickname and submissions.

## Firebase setup

1. Create a Firebase project.
2. Enable **Authentication > Sign-in method > Anonymous**.
3. Enable **Realtime Database**.
4. Replace the Realtime Database Rules with `firebase.rules.json`.
5. Create a web app and copy its Firebase config values.
6. Create a service account key in **Project settings > Service accounts**. Keep this JSON private.

## Netlify environment variables

Set these in Netlify project settings, not in GitHub:

```txt
INSTRUCTOR_PASSWORD
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_DATABASE_URL
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
FIREBASE_SERVICE_ACCOUNT
```

`FIREBASE_SERVICE_ACCOUNT` should be the full service account JSON as a single-line string.

## Deploy

Connect this repo to Netlify. Build command can be empty, and publish directory is `.` from `netlify.toml`.

## Instructor password troubleshooting

If instructor login says `Password mismatch`, the request reached the Netlify Function, but the submitted password did not match Netlify's `INSTRUCTOR_PASSWORD` value.

Check these first:

1. In Netlify, set the environment variable name to exactly `INSTRUCTOR_PASSWORD`.
2. Put only the password in the value field. Do not include `INSTRUCTOR_PASSWORD=`, quotes, or backticks.
3. Make sure the variable applies to the deploy context you are using, usually Production.
4. After changing environment variables, trigger a fresh Netlify deploy.
5. Open the Netlify Function logs for `instructor-login`; mismatch logs show only submitted/configured lengths, never the password.

## Can this run on GitHub Pages only?

The student game can run on GitHub Pages if the Firebase config is public and students use anonymous auth. However, GitHub Pages cannot securely hide an instructor password because it only serves static files. To keep the password private, use a server-side component such as Netlify Functions, Firebase Cloud Functions, Cloudflare Workers, or another backend.
