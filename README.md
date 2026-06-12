# 🔒 CodeAlpha_PhishingAwareness

> An interactive, animated Phishing Awareness Training module built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## 📸 Overview

This project is a fully self-contained web-based security training module designed to educate users about phishing attacks, social engineering tactics, and how to defend against them. It includes real-world examples, 3D animations, and a personalized interactive quiz.

---

## ✨ Features

### 🎨 Visual & Animations
- Animated **particle network** hero background (canvas-based)
- **3D flip cards** for all 6 phishing attack types
- **Mouse-tracking 3D tilt** on defense cards
- **Staggered scroll-reveal** animations on every section
- **Smooth scroll navigation** with custom easing (easeInOutQuart)
- Live **progress bar** tracking how far through the module you are
- Active nav link highlights as you scroll

### 📚 Training Content

| Module | Topic |
|--------|-------|
| 01 | What Is Phishing? (6 types with 3D flip cards) |
| 02 | Recognizing Phishing Emails & Fake Websites |
| 03 | Social Engineering Tactics |
| 04 | The Phishing Attack Lifecycle (6-stage timeline) |
| 05 | Your Defense Playbook + Incident Response |
| 06 | Interactive Knowledge Quiz |

### 🧠 Quiz
- 10 questions covering all modules
- Enter your name before starting
- Personalized result: **"[Name], your score is X/10 — PASSED/FAILED"**
- Correct answers revealed with explanations after submission
- Retake support

---

## 🚀 How to Run

No build step, no npm, no dependencies.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/CodeAlpha_PhishingAwareness.git

# Open in browser
open index.html
```

Or just double-click `index.html` — it runs entirely in the browser.

---

## 📁 File Structure

```
CodeAlpha_PhishingAwareness/
├── index.html      # All markup and module structure
├── style.css       # All styles, animations, 3D effects
├── app.js          # Particles, smooth scroll, quiz engine
└── README.md       # This file
```

---

## 🛡️ Topics Covered

- Email Phishing, Spear Phishing, Smishing, Vishing, Whaling, Pharming
- How to spot fake sender domains and spoofed URLs
- Annotated real phishing email with red flag tooltips
- Social engineering: Fear, Greed, Authority, Trust, Reciprocity, Social Proof
- Full attack lifecycle: Recon → Infrastructure → Lure → Delivery → Harvest → Exploit
- Defense: MFA, Password Managers, Out-of-band Verification, Email Headers, Reporting
- What to do immediately if you've been phished

---

## 🏫 Built For

**CodeAlpha Internship** — Cybersecurity Task 2: Phishing Awareness Training

---

## 🧑‍💻 Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure and semantic markup |
| CSS3 | 3D transforms, animations, transitions, grid/flex layout |
| Vanilla JavaScript | Canvas particles, smooth scroll engine, quiz logic, IntersectionObserver |

---

## 👤 Author

**Obaid Ur Rehman**
- GitHub: [@obaidbalouch1](https://github.com/obaidbalouch1)

---

© 2026 Obaid Ur Rehman. All rights reserved.
