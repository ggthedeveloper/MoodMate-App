# MoodMate App

Your personal emotional wellness companion.

Live at: https://ggthedeveloper.github.io/MoodMate-App/

---

## 🌟 Key Features

### 🔐 Security & Authentication
- **Modern Web Crypto SHA-256 Hashing:** Passwords hashed with standard `crypto.subtle.digest('SHA-256')` with seamless backwards-compatibility for existing accounts.
- **Input Validation:** Required field checks, minimum password constraints, and password confirmation checks.
- **Safe Persistence:** Isolated client-side `localStorage` data storage with automatic corruption recovery.

### 📊 Enhanced Statistics & Insights
- **7-Day Trend Analysis:** Identifies balance and emotional trajectory across logged check-ins.
- **Progressive Milestones:** Displays friendly progress prompt when fewer than 7 entries exist.
- **Offline Chart Resilience:** Native responsive CSS breakdown fallback if Chart.js CDN is unavailable or offline.
- **Reliable Streak Tracking:** Accurately retains user streak active through the current day without premature morning resets.

### 🎯 Mindful Journaling & Activities
- **Context-Aware Mood Suggestions:** Morning, afternoon, and evening wellness recommendations.
- **Micro-Journaling:** Integrated word counter and mood timeline.
- **Interactive Wellness Games:** Deep breathing exercises, memory cards, affirmation clicker, and positive word scramble.
- **Ambient Playlists:** Calming music streams curated by emotional state.

---

## 🧪 Testing

Automated test suite verifying streak calculations, security hashing, and sanitization:

```bash
# Run tests
npm test
```

---

## 🚀 Running Locally

No bundler required. Open directly in any modern browser:

```bash
open index.html
```

---

## 👨‍💻 Developer

Developed by **Gaurav Gautam** (`ggthedeveloper`).
