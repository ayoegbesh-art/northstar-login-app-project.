# Northstar — React + Firebase Login / Registration

A responsive React authentication starter with Firebase Email/Password Authentication.

## Included

- Register with name, email and password
- Sign in and sign out
- Firebase auth session listener
- Password reset email
- Basic user-friendly error messages
- Responsive layout
- Firebase Hosting configuration

## 1. Create your Firebase project

1. Open https://console.firebase.google.com and create a project.
2. Add a **Web app** to the project.
3. Open **Authentication → Sign-in method** and enable **Email/Password**.
4. Open **Project settings → General → Your apps** and copy the Firebase web app configuration.

## 2. Configure the app

```bash
npm install
```

Copy `.env.example` to `.env`, then fill in the values from your Firebase web app config:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Restart the dev server after editing `.env`.

## 3. Run locally

```bash
npm run dev
```

Open the local URL printed by Vite. Register a test account to verify the flow.

## 4. Deploy to Firebase Hosting

Install the Firebase CLI:

```bash
npm install -g firebase-tools
```

Sign in and connect this folder to your Firebase project:

```bash
firebase login
firebase init hosting
```

During setup:
- Select the Firebase project you created.
- Set the public directory to `dist`.
- Configure as a single-page app: **Yes**.
- If asked to overwrite `index.html`, choose **No** (the app's existing file is needed).

Build and deploy:

```bash
npm run build
firebase deploy --only hosting
```

Firebase CLI prints your deployed Hosting URL.

## Important notes

- `.env` is ignored by Git. Do not commit it.
- Firebase web configuration values are identifiers used by the client SDK; protect your data with Firebase Security Rules and use App Check where appropriate.
- This starter uses Firebase Authentication only. It does not store passwords in your own database.
- Add your deployed domain under **Authentication → Settings → Authorized domains** if Firebase requires it.
