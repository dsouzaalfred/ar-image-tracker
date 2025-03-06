# AR Image Tracker

This is a Next.js application that uses AR.js and A-Frame to create augmented reality experiences. The app includes three AR experiences:
- Duck AR: Displays a 3D duck model
- Video AR: Plays a video in AR
- Fox AR: Shows an animated fox model

## Prerequisites

1. Install Node.js (v18 or later)
2. Install ngrok: `npm install -g ngrok` or download from [ngrok.com](https://ngrok.com)
3. Sign up for a free ngrok account and get your authtoken

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The app will start on [http://localhost:3000](http://localhost:3000). However, AR.js requires HTTPS for camera access, so we'll need to use ngrok.

### 3. Set Up ngrok

1. If you haven't already, authenticate ngrok with your authtoken:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

2. Start ngrok to create a secure tunnel to your local server:
```bash
ngrok http 3000
```

3. Look for the `Forwarding` line in the ngrok output. You'll see something like:
```
Forwarding    https://xxxx-xx-xx-xx-xx.ngrok.io -> localhost:3000
```

4. Copy the HTTPS URL (e.g., `https://xxxx-xx-xx-xx-xx.ngrok.io`) and open it in your mobile browser.

## Using the AR Experiences

1. Allow camera access when prompted
2. Point your camera at the appropriate marker for each experience:
   - Duck AR: Hiro marker
   - Video AR: Kanji marker
   - Fox AR: Custom fox marker (available in the app)

## Important Notes

- AR experiences require HTTPS, which is why we use ngrok for local development
- The ngrok URL changes each time you restart ngrok (unless you have a paid account)
- For best performance, use a well-lit environment and ensure the marker is clearly visible

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
