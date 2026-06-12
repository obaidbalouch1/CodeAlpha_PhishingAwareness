/* ═══════════════════════════════════════
   PARTICLE CANVAS — HERO BACKGROUND
═══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const COLORS = ['rgba(59,130,246,', 'rgba(6,182,212,', 'rgba(99,102,241,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(random) {
      this.x = Math.random() * W;
      this.y = random ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.6 + 0.2);
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      // connection params
      this.size = this.r;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset(false);
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initParticleList() {
    const count = Math.min(Math.floor((W * H) / 8000), 160);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize(); initParticleList();
  });
  resize(); initParticleList(); loop();
})();


/* ═══════════════════════════════════════
   SMOOTH SCROLL ENGINE
   — Custom easing so nav clicks glide
     instead of snapping
═══════════════════════════════════════ */
const NAV_HEIGHT = 64; // navbar + progress bar

function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function smoothScrollTo(targetY, duration = 900) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuart(progress);
    window.scrollTo(0, startY + distance * ease);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Hijack all anchor nav clicks
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();

    // Brief overlay flash for a cinematic section-transition feel
    const overlay = document.getElementById('page-transition');
    overlay.classList.add('flash');
    setTimeout(() => overlay.classList.remove('flash'), 350);

    const targetY = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    smoothScrollTo(targetY, 950);
  });
});


/* ═══════════════════════════════════════
   SCROLL REVEAL & PROGRESS BAR
═══════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-up, .tactic-3d, .defense-card, .tl-item, .quiz-question'
).forEach(el => revealObserver.observe(el));

// Active nav link highlight as user scrolls
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight * 0.4;
  let current = '';
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollMid) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', () => {
  const st = window.scrollY;
  const dh = document.documentElement.scrollHeight - window.innerHeight;
  const pct = dh > 0 ? Math.round((st / dh) * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% complete';

  // Navbar solidify
  document.getElementById('navbar').style.background = st > 80
    ? 'rgba(3,7,18,0.97)'
    : 'rgba(3,7,18,0.8)';

  updateActiveNav();
}, { passive: true });


/* ═══════════════════════════════════════
   3D TILT on defense cards
═══════════════════════════════════════ */
document.querySelectorAll('.defense-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -6;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 6;
    card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ═══════════════════════════════════════
   QUIZ DATA — 10 Questions
═══════════════════════════════════════ */
const questions = [
  {
    q: "You receive an email from 'support@paypa1-alerts.com' asking you to verify your PayPal account. What should you do?",
    options: [
      "Click the link and log in to verify your identity",
      "Reply to the email asking for more information",
      "Ignore and delete — the sender domain is a misspelled fake",
      "Forward it to a friend to check"
    ],
    answer: 2,
    explanation: "'paypa1-alerts.com' is not 'paypal.com'. The number '1' replaces the letter 'l' — a classic typosquatting trick. Always check the full sender domain."
  },
  {
    q: "A website shows a padlock icon and uses HTTPS. Does this guarantee it's safe to enter your password?",
    options: [
      "Yes — HTTPS always means the website is legitimate",
      "No — HTTPS encrypts the connection but doesn't verify the site's legitimacy",
      "Yes — only real companies can obtain SSL certificates",
      "Only if the padlock is green"
    ],
    answer: 1,
    explanation: "Attackers regularly use HTTPS on phishing sites. Free SSL certificates (Let's Encrypt) are available to anyone. Always verify the full domain, not just the padlock."
  },
  {
    q: "Which of these URLs is most likely a phishing site impersonating a bank?",
    options: [
      "https://www.mybank.com/login",
      "https://mybank.com.secure-login.net/verify",
      "https://support.mybank.com/help",
      "https://mybank.com/account/settings"
    ],
    answer: 1,
    explanation: "The real domain here is 'secure-login.net' — not 'mybank.com'. Attackers put the real brand name as a subdomain before their own domain to trick users scanning too quickly."
  },
  {
    q: "Someone calls you claiming to be from IT support and asks for your password to fix a critical system issue. What do you do?",
    options: [
      "Give it — IT staff legitimately need access to fix issues",
      "Give it only if they can tell you your username first",
      "Refuse — no legitimate IT professional will ever ask for your password",
      "Give them a wrong password to test if they're real"
    ],
    answer: 2,
    explanation: "Legitimate IT staff have admin tools that don't require your password. This is a classic vishing (voice phishing) tactic. Hang up and report it to your security team."
  },
  {
    q: "What is 'spear phishing' and what makes it more dangerous than regular phishing?",
    options: [
      "It's sent to millions of people simultaneously, making it more effective",
      "It targets executives exclusively with legal threats",
      "It uses personalized information (your name, employer, role) to craft convincing targeted attacks",
      "It only uses phone calls instead of email"
    ],
    answer: 2,
    explanation: "Spear phishing uses OSINT (LinkedIn, social media, data breaches) to personalize attacks. Success rates can reach 70%, compared to ~3% for generic phishing emails."
  },
  {
    q: "Which of the following is NOT a reliable indicator that an email is phishing?",
    options: [
      "The email uses urgent language: 'Act within 24 hours or lose access!'",
      "The email is asking you to click a link to reset your password",
      "The email was flagged by your spam filter",
      "The email sender address is from the company's real domain"
    ],
    answer: 3,
    explanation: "A matching sender domain is a positive sign, but not conclusive — attackers can compromise real accounts or use sophisticated spoofing. All emails requesting action still warrant verification."
  },
  {
    q: "Why does using a password manager help protect against phishing?",
    options: [
      "It generates harder passwords that attackers can't guess",
      "It autofills credentials only on the exact correct domain, so it won't fill on a fake site",
      "It alerts you when you visit any dangerous website",
      "It blocks malicious email attachments automatically"
    ],
    answer: 1,
    explanation: "Password managers match the exact domain. If you're on 'paypa1.com' instead of 'paypal.com', the autofill won't trigger — acting as a built-in anti-phishing check."
  },
  {
    q: "What is the average time it takes an organization to discover they've been breached after initial compromise?",
    options: [
      "About 2–3 days",
      "About 2–3 weeks",
      "About 207 days",
      "About 12 hours"
    ],
    answer: 2,
    explanation: "According to IBM's Cost of a Data Breach Report, the average dwell time (time from breach to detection) is around 207 days — nearly 7 months of undetected access."
  },
  {
    q: "You accidentally clicked a phishing link and entered your work credentials. What is your FIRST action?",
    options: [
      "Wait and see if anything unusual happens before acting",
      "Disconnect from the network and immediately report it to your IT/security team",
      "Change your password in the same browser tab you used",
      "Restart your computer"
    ],
    answer: 1,
    explanation: "Speed is critical. Disconnect immediately to stop potential malware communicating out, then report to IT so they can lock the account, scan the device, and trigger incident response."
  },
  {
    q: "Which social engineering tactic does this message use? 'All employees have completed the mandatory security update — please do so immediately via the link below.'",
    options: [
      "Fear and urgency",
      "Authority impersonation",
      "Social proof (herd mentality)",
      "Greed and reward"
    ],
    answer: 2,
    explanation: "This uses social proof — the idea that 'everyone else already did it' makes non-compliance seem abnormal. It pressures targets into acting without verifying the legitimacy of the request."
  }
];


/* ═══════════════════════════════════════
   QUIZ ENGINE
═══════════════════════════════════════ */
function buildQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';
    div.id = `question-${i}`;
    div.innerHTML = `
      <div class="quiz-q-header">
        <span class="q-num">Q${i + 1}</span>
        <p>${q.q}</p>
      </div>
      <div class="quiz-options">
        ${q.options.map((opt, j) => `
          <label class="quiz-option" id="opt-${i}-${j}">
            <input type="radio" name="q${i}" value="${j}" />
            ${opt}
          </label>
        `).join('')}
      </div>
      <div class="quiz-explanation" id="exp-${i}"></div>
    `;
    container.appendChild(div);

    // stagger reveal
    setTimeout(() => {
      div.classList.add('visible');
    }, i * 80);
  });

  // re-observe new elements
  document.querySelectorAll('.quiz-question').forEach(el => revealObserver.observe(el));
}

function submitQuiz() {
  let score = 0;
  let allAnswered = true;

  // Validate name
  const nameInput = document.getElementById('quizName');
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add('name-error');
    nameInput.placeholder = 'Please enter your name first!';
    nameInput.focus();
    setTimeout(() => nameInput.classList.remove('name-error'), 1800);
    return;
  }

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) { allAnswered = false; return; }

    const val = parseInt(selected.value);
    const expEl = document.getElementById(`exp-${i}`);
    expEl.textContent = '💡 ' + q.explanation;
    expEl.classList.add('show');

    document.querySelectorAll(`input[name="q${i}"]`).forEach(r => r.disabled = true);

    q.options.forEach((_, j) => {
      const label = document.getElementById(`opt-${i}-${j}`);
      if (j === q.answer) label.classList.add('show-correct');
      else if (j === val && val !== q.answer) label.classList.add('incorrect');
    });

    if (val === q.answer) score++;
  });

  if (!allAnswered) {
    const btn = document.getElementById('submitQuiz');
    btn.textContent = '⚠ Please answer all questions!';
    setTimeout(() => { btn.innerHTML = '<span>Submit Answers</span>'; }, 2000);
    return;
  }

  const pct = Math.round((score / questions.length) * 100);
  const passed = pct >= 70;
  const resultEl = document.getElementById('quiz-result');
  resultEl.classList.remove('hidden', 'pass', 'fail');
  resultEl.classList.add(passed ? 'pass' : 'fail');

  resultEl.innerHTML = `
    <div class="result-name">${name}</div>
    <span class="result-score">${pct}%</span>
    <p class="result-detail">Your score is <strong>${score} / ${questions.length}</strong></p>
    <div class="result-badge ${passed ? 'badge-pass' : 'badge-fail'}">
      ${passed ? '🎉 PASSED' : '❌ FAILED'}
    </div>
    <p class="result-msg">
      ${passed
        ? `Well done, <strong>${name}</strong>! You passed the Phishing Awareness Training. Keep staying vigilant.`
        : `Sorry, <strong>${name}</strong>. You didn't pass this time — review the modules above and try again. You need 70% to pass.`
      }
    </p>
  `;

  // Lock name input
  nameInput.disabled = true;

  document.getElementById('submitQuiz').classList.add('hidden');
  document.getElementById('retakeQuiz').classList.remove('hidden');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function retakeQuiz() {
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('submitQuiz').innerHTML = '<span>Submit Answers</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  document.getElementById('submitQuiz').classList.remove('hidden');
  document.getElementById('retakeQuiz').classList.add('hidden');
  // Re-enable name field so user can change it
  const nameInput = document.getElementById('quizName');
  nameInput.disabled = false;
  nameInput.focus();
  buildQuiz();
}

// Init
buildQuiz();
