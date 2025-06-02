# 🧠 Pulse Board

**Pulse Board** is a Web3-ready collaboration and feedback platform that empowers creatives to engage their communities through voting polls and comment threads. Built using [Reown AppKit](https://reown.app/) for wallet onboarding and Firebase for data storage, the app offers a streamlined way for creatives and contributors to collaborate in a decentralized environment.

## ✨ What It Does

- 🎨 **Creatives** can request:
  - 🗳️ A **voting poll** to get feedback from contributors.
  - 💬 A **comment thread** to collect messages, ideas, or critiques.
- 🤝 **Contributors** connect with their wallets and participate by voting or commenting.
- 🧾 All submissions are tied to the contributor’s **wallet address**, enabling future reward distribution.
- 🪙 **Coming Soon**: Winning voters or commenters will be rewarded with an **NFT**!

---
## 🚀 Live Demo

Check out the deployed Pulse Board app here:  
[https://main.d1b9edbs8hrfxu.amplifyapp.com/](https://main.d1b9edbs8hrfxu.amplifyapp.com/)
---

## 🚀 How It Works

### 🔐 Wallet Login

Powered by **Reown AppKit**, users can onboard via their Web3 wallet with a single click — no seed phrases or MetaMask popups.

### ☁️ Contribution Recording

Once logged in, users’ wallet addresses are securely logged in **Firebase Firestore**, along with their vote or comment. This makes it possible to track participation for future reward drops like NFTs.

### 🧬 NFT Rewards (Future Feature)

In a future release, we’ll use the stored wallet addresses to:
- Automatically mint NFTs to contributors who submit the most popular comment or vote for the winning option.
- Gamify participation and build long-term loyalty with Web3-native incentives.

---

## 🛠️ Tech Stack

| Layer        | Tech                |
| ------------ | ------------------- |
| Frontend     | Vite + React        |
| Wallet Login | Reown AppKit        |
| Backend      | Firebase Firestore  |
| Hosting      | Fleek (IPFS)        |
| Styling      | Custom CSS          |

---

## 🧰 Getting Started

### 1. Clone the Repository


git clone https://github.com/yourusername/pulse-board.git
cd pulse-board
2. Install Dependencies

npm install
3. Create a .env File
env
Copy
Edit
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
🔒 Do not commit this file. It’s ignored via .gitignore.

4. Run the Dev Server

npm run dev
Open http://localhost:5173 in your browser.

☁️ Deploying to Fleek
Go to fleek.co

Connect your GitHub repo

Set build settings:

Framework: Vite

Build command: npm run build

Publish directory: dist

Add the same environment variables used in your .env file

📌 Roadmap
 Wallet login via Reown AppKit

 Vote + comment contribution forms

 Firebase data recording

 NFT rewards for top contributors (coming soon!)

 DAO integration for automated funding/voting (future)

📄 License
MIT

👋 Contributing
Feel free to open an issue or submit a pull request!
