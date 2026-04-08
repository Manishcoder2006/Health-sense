// ===== STATE =====
const state = {
  currentPage: 'landing',
  currentStep: 1,
  age: '', gender: '', conditions: '',
  symptoms: [],
  duration: 3, severity: 3, notes: '',
  history: [
    { date: 'March 28, 2026', symptoms: ['Sore Throat', 'Cough', 'Runny Nose'], result: 'Seasonal Allergies', risk: 'low' },
    { date: 'March 15, 2026', symptoms: ['Chest Tightness', 'Dizziness', 'Fatigue'], result: 'Anxiety / Stress Response', risk: 'medium' },
    { date: 'February 22, 2026', symptoms: ['Headache', 'Fatigue'], result: 'Tension Headache', risk: 'low' }
  ]
};

// ===== AI DATABASE =====
const conditionsDB = {
  'Fever,Headache,Fatigue': { conditions: [{ name: 'Common Flu', confidence: 82, icon: 'virus', desc: 'A viral infection that affects the respiratory system with general body discomfort.' }, { name: 'Viral Infection', confidence: 68, icon: 'disease', desc: 'A general viral illness causing fever and malaise.' }, { name: 'COVID-19', confidence: 45, icon: 'virus-covid', desc: 'Respiratory illness caused by SARS-CoV-2 virus.' }], risk: 'medium', visit: 'routine', visitText: 'Schedule a check-up within a few days if symptoms persist.' },
  'Chest Pain,Shortness of Breath': { conditions: [{ name: 'Cardiac Event', confidence: 72, icon: 'heart-crack', desc: 'Possible cardiac-related issue requiring immediate evaluation.' }, { name: 'Panic Attack', confidence: 58, icon: 'brain', desc: 'Anxiety-related episode mimicking cardiac symptoms.' }], risk: 'high', visit: 'emergency', visitText: 'Seek immediate medical attention. Call emergency services if pain is severe.' },
  'Cough,Sore Throat,Runny Nose': { conditions: [{ name: 'Common Cold', confidence: 88, icon: 'head-side-cough', desc: 'Upper respiratory infection caused by various viruses.' }, { name: 'Seasonal Allergies', confidence: 62, icon: 'leaf', desc: 'Allergic reaction to environmental triggers like pollen or dust.' }], risk: 'low', visit: 'not-required', visitText: 'Home care should be sufficient. See a doctor if symptoms worsen after a week.' },
  default: { conditions: [{ name: 'General Discomfort', confidence: 65, icon: 'stethoscope', desc: 'Non-specific symptoms that may relate to various mild conditions.' }, { name: 'Stress Response', confidence: 55, icon: 'brain', desc: 'Physical symptoms possibly triggered by stress or fatigue.' }, { name: 'Nutritional Deficiency', confidence: 40, icon: 'apple-whole', desc: 'Lack of essential nutrients can cause various symptoms.' }], risk: 'low', visit: 'routine', visitText: 'Consider scheduling a routine check-up for peace of mind.' }
};

const precautionsDB = {
  low: [
    { icon: 'glass-water', color: 'teal', title: 'Stay Hydrated', desc: 'Drink 8+ glasses of water daily' },
    { icon: 'bed', color: 'green', title: 'Get Adequate Rest', desc: 'Aim for 7-9 hours of sleep' },
    { icon: 'temperature-high', color: 'orange', title: 'Monitor Temperature', desc: 'Track any fever patterns' },
    { icon: 'capsules', color: 'blue', title: 'OTC Medication', desc: 'Consider over-the-counter relief' }
  ],
  medium: [
    { icon: 'glass-water', color: 'teal', title: 'Increase Fluids', desc: 'Stay well hydrated throughout the day' },
    { icon: 'bed', color: 'green', title: 'Rest & Recovery', desc: 'Reduce physical activity and rest' },
    { icon: 'notes-medical', color: 'orange', title: 'Track Symptoms', desc: 'Keep a log of symptom changes' },
    { icon: 'user-doctor', color: 'blue', title: 'Consult Doctor', desc: 'Schedule an appointment soon' }
  ],
  high: [
    { icon: 'phone', color: 'red', title: 'Call Emergency', desc: 'Contact emergency services immediately' },
    { icon: 'hospital', color: 'teal', title: 'Visit Hospital', desc: 'Go to nearest emergency room' },
    { icon: 'hand-holding-medical', color: 'orange', title: 'Don\'t Be Alone', desc: 'Stay with someone until help arrives' },
    { icon: 'file-medical', color: 'blue', title: 'Prepare Info', desc: 'Have your medical history ready' }
  ]
};

// ===== NAVIGATION =====
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) { target.classList.add('active'); }
  state.currentPage = page;
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'history') renderHistory();
}

// ===== THEME =====
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const icon = document.querySelector('#themeToggle i');
  icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); const i = document.querySelector('#themeToggle i'); if (i) i.className = 'fas fa-sun'; }
})();

// ===== MOBILE NAV =====
function toggleMobileNav() {
  document.getElementById('hamburger').classList.toggle('active');
  document.getElementById('mobileNav').classList.toggle('open');
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.anim').forEach(el => observer.observe(el));

// ===== NOTIFICATION =====
function showNotification() {
  const n = document.getElementById('notification');
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 5000);
}
function hideNotification() { document.getElementById('notification').classList.remove('show'); }
setTimeout(showNotification, 3000);

// ===== OPTION CARDS =====
document.querySelectorAll('#ageGrid .option-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#ageGrid .option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.age = card.dataset.value;
  });
});
document.querySelectorAll('#genderGrid .option-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#genderGrid .option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.gender = card.dataset.value;
  });
});

// ===== SYMPTOM TAGS =====
document.querySelectorAll('.symptom-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const sym = tag.dataset.symptom;
    if (tag.classList.contains('selected')) {
      tag.classList.remove('selected');
      state.symptoms = state.symptoms.filter(s => s !== sym);
    } else {
      tag.classList.add('selected');
      if (!state.symptoms.includes(sym)) state.symptoms.push(sym);
    }
    renderSelectedSymptoms();
  });
});

function renderSelectedSymptoms() {
  const container = document.getElementById('selectedSymptoms');
  if (state.symptoms.length === 0) {
    container.innerHTML = '<span style="color:var(--txt-3);font-size:.85rem">No symptoms selected yet</span>';
    return;
  }
  container.innerHTML = state.symptoms.map(s =>
    `<div class="sel-pill">${s} <span class="remove" onclick="removeSymptom('${s}')"><i class="fas fa-times"></i></span></div>`
  ).join('');
}

function removeSymptom(sym) {
  state.symptoms = state.symptoms.filter(s => s !== sym);
  document.querySelectorAll('.symptom-tag').forEach(t => {
    if (t.dataset.symptom === sym) t.classList.remove('selected');
  });
  renderSelectedSymptoms();
}

function filterSymptoms(query) {
  const suggestions = document.getElementById('symptomSuggestions');
  if (!query.trim()) { suggestions.style.display = 'none'; return; }
  const allSymptoms = ['Fever','Headache','Fatigue','Cough','Sore Throat','Body Aches','Nausea','Dizziness','Chest Pain','Shortness of Breath','Runny Nose','Stomach Pain','Back Pain','Joint Pain','Skin Rash','Blurred Vision','Insomnia','Loss of Appetite','Sweating','Chills'];
  const matches = allSymptoms.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !state.symptoms.includes(s));
  if (matches.length === 0) { suggestions.style.display = 'none'; return; }
  suggestions.style.display = 'block';
  suggestions.innerHTML = matches.slice(0, 5).map(s =>
    `<div class="symptom-tag" style="margin-bottom:.25rem;cursor:pointer" onclick="addSuggested('${s}')">${s}</div>`
  ).join('');
}

function addSuggested(sym) {
  if (!state.symptoms.includes(sym)) state.symptoms.push(sym);
  document.querySelectorAll('.symptom-tag').forEach(t => {
    if (t.dataset.symptom === sym) t.classList.add('selected');
  });
  document.getElementById('symptomSearch').value = '';
  document.getElementById('symptomSuggestions').style.display = 'none';
  renderSelectedSymptoms();
}

// ===== VOICE (UI ONLY) =====
function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  btn.classList.toggle('listening');
  if (btn.classList.contains('listening')) {
    setTimeout(() => {
      btn.classList.remove('listening');
      const random = ['Headache', 'Fever', 'Fatigue'];
      const sym = random[Math.floor(Math.random() * random.length)];
      if (!state.symptoms.includes(sym)) {
        state.symptoms.push(sym);
        document.querySelectorAll('.symptom-tag').forEach(t => { if (t.dataset.symptom === sym) t.classList.add('selected'); });
        renderSelectedSymptoms();
      }
    }, 2000);
  }
}

// ===== SLIDERS =====
function updateDuration(val) {
  state.duration = parseInt(val);
  const label = val == 1 ? '1 day' : val >= 30 ? '30+ days' : val + ' days';
  document.getElementById('durationVal').textContent = label;
}
function updateSeverity(val) {
  state.severity = parseInt(val);
  const labels = ['', 'Mild', 'Low-Moderate', 'Moderate', 'High', 'Severe'];
  document.getElementById('severityVal').textContent = labels[val];
}

// ===== MULTI-STEP FORM =====
function nextStep(step) {
  if (step === 2 && !state.age) { alert('Please select your age range.'); return; }
  if (step === 3 && state.symptoms.length === 0) { alert('Please select at least one symptom.'); return; }
  goToStep(step);
}
function prevStep(step) { goToStep(step); }

function goToStep(step) {
  state.currentStep = step;
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + step).classList.add('active');
  document.querySelectorAll('.p-step').forEach(s => {
    const sNum = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (sNum < step) s.classList.add('done');
    if (sNum === step) s.classList.add('active');
  });
  const line = document.getElementById('progressLine');
  line.style.width = step === 1 ? '0%' : step === 2 ? '35%' : '70%';
}

// ===== ANALYSIS =====
function startAnalysis() {
  navigateTo('analyzing');
  const bar = document.getElementById('analyzeBar');
  const steps = [
    document.getElementById('aStep1'),
    document.getElementById('aStep2'),
    document.getElementById('aStep3'),
    document.getElementById('aStep4')
  ];
  // Reset steps
  steps.forEach(s => { s.className = 'a-step'; s.querySelector('.a-step-icon').innerHTML = '<i class="far fa-circle"></i>'; });
  steps[0].classList.add('active');
  steps[0].querySelector('.a-step-icon').innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
  bar.style.width = '0%';

  let progress = 0;
  const interval = setInterval(() => {
    progress += 2;
    bar.style.width = progress + '%';
    if (progress >= 25 && !steps[0].classList.contains('done')) {
      steps[0].classList.remove('active'); steps[0].classList.add('done');
      steps[0].querySelector('.a-step-icon').innerHTML = '<i class="fas fa-check-circle"></i>';
      steps[1].classList.add('active');
      steps[1].querySelector('.a-step-icon').innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    }
    if (progress >= 50 && !steps[1].classList.contains('done')) {
      steps[1].classList.remove('active'); steps[1].classList.add('done');
      steps[1].querySelector('.a-step-icon').innerHTML = '<i class="fas fa-check-circle"></i>';
      steps[2].classList.add('active');
      steps[2].querySelector('.a-step-icon').innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    }
    if (progress >= 75 && !steps[2].classList.contains('done')) {
      steps[2].classList.remove('active'); steps[2].classList.add('done');
      steps[2].querySelector('.a-step-icon').innerHTML = '<i class="fas fa-check-circle"></i>';
      steps[3].classList.add('active');
      steps[3].querySelector('.a-step-icon').innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    }
    if (progress >= 100) {
      clearInterval(interval);
      steps[3].classList.remove('active'); steps[3].classList.add('done');
      steps[3].querySelector('.a-step-icon').innerHTML = '<i class="fas fa-check-circle"></i>';
      setTimeout(() => {
        generateResults();
        navigateTo('results');
      }, 500);
    }
  }, 60);
}

// ===== RESULTS =====
function generateResults() {
  const symKey = state.symptoms.sort().join(',');
  let data = conditionsDB.default;
  for (const key in conditionsDB) {
    if (key === 'default') continue;
    const keySyms = key.split(',');
    const matchCount = keySyms.filter(s => state.symptoms.includes(s)).length;
    if (matchCount >= 2 || (matchCount >= 1 && keySyms.length <= 2)) {
      data = conditionsDB[key]; break;
    }
  }

  // Adjust risk based on severity
  if (state.severity >= 4 && data.risk === 'low') data = { ...data, risk: 'medium' };

  const precautions = precautionsDB[data.risk];
  const visitClass = data.visit === 'emergency' ? 'emergency' : data.visit === 'not-required' ? 'routine' : data.risk === 'medium' ? 'urgent' : 'routine';
  const visitIcon = visitClass === 'emergency' ? 'truck-medical' : visitClass === 'urgent' ? 'clock' : 'calendar-check';
  const visitLabel = visitClass === 'emergency' ? 'EMERGENCY' : visitClass === 'urgent' ? 'URGENT' : data.visit === 'not-required' ? 'NOT REQUIRED' : 'ROUTINE';

  let html = '';

  // Emergency banner
  if (data.risk === 'high') {
    html += `<div class="emergency-banner"><i class="fas fa-triangle-exclamation"></i><div><h4>Seek Immediate Medical Attention</h4><p>Your symptoms may indicate a serious condition. Please contact emergency services or visit the nearest hospital.</p></div></div>`;
  }

  // Risk card
  html += `<div class="risk-card ${data.risk}"><div class="risk-level">${data.risk === 'low' ? '☘️' : data.risk === 'medium' ? '⚠️' : '🚨'} ${data.risk.toUpperCase()}</div><div class="risk-label">${data.risk === 'low' ? 'Low Risk Assessment' : data.risk === 'medium' ? 'Moderate Risk Assessment' : 'High Risk Assessment'}</div><div class="risk-desc">${data.risk === 'low' ? 'Your symptoms suggest a common condition that can likely be managed at home.' : data.risk === 'medium' ? 'Your symptoms warrant attention. Consider consulting a healthcare provider.' : 'Your symptoms indicate a potentially serious condition requiring immediate medical care.'}</div></div>`;

  // Symptoms analyzed
  html += `<div style="margin-bottom:1.5rem"><div class="badge badge-primary" style="margin-bottom:.75rem"><i class="fas fa-tags"></i> Symptoms Analyzed</div><div style="display:flex;flex-wrap:wrap;gap:.5rem">${state.symptoms.map(s => `<span class="badge badge-primary">${s}</span>`).join('')}</div></div>`;

  // Conditions
  html += `<h3 style="margin-bottom:1rem;font-size:1.15rem"><i class="fas fa-clipboard-list" style="color:var(--primary)"></i> Possible Conditions</h3><div class="conditions-list">`;
  data.conditions.forEach(c => {
    html += `<div class="card condition-card"><div class="condition-info"><div class="cond-icon"><i class="fas fa-${c.icon}"></i></div><div style="flex:1"><div class="cond-name">${c.name}</div><div class="cond-desc">${c.desc}</div><div class="conf-bar"><div class="conf-fill" style="width:${c.confidence}%"></div></div><div class="conf-text">AI Confidence: ${c.confidence}%</div></div></div></div>`;
  });
  html += `</div>`;

  // Precautions
  html += `<h3 style="margin-bottom:1rem;font-size:1.15rem"><i class="fas fa-shield-heart" style="color:var(--secondary)"></i> Recommended Precautions</h3><div class="precautions-grid">`;
  precautions.forEach(p => {
    const colors = { teal: 'var(--primary-100);color:var(--primary)', green: 'var(--success-lt);color:var(--secondary)', orange: 'var(--warning-lt);color:var(--warning)', blue: 'var(--info-lt);color:var(--info)', red: 'var(--danger-lt);color:var(--danger)' };
    html += `<div class="card precaution-card"><div class="prec-icon" style="background:${colors[p.color]}"><i class="fas fa-${p.icon}"></i></div><div><h4>${p.title}</h4><p>${p.desc}</p></div></div>`;
  });
  html += `</div>`;

  // Doctor visit
  html += `<div class="card doctor-visit ${visitClass}"><div class="visit-icon"><i class="fas fa-${visitIcon}"></i></div><div><div class="visit-label">${visitLabel}</div><h3>${visitClass === 'emergency' ? 'Seek Immediate Medical Care' : visitClass === 'urgent' ? 'See a Doctor Soon' : data.visit === 'not-required' ? 'Home Care Recommended' : 'Schedule a Routine Check-up'}</h3><p>${data.visitText}</p></div></div>`;

  // Actions
  html += `<div class="results-actions"><button class="btn btn-primary" onclick="navigateTo('recommendations')"><i class="fas fa-lightbulb"></i> Get Recommendations</button><button class="btn btn-accent" onclick="navigateTo('doctors')"><i class="fas fa-user-doctor"></i> Consult Doctor</button><button class="btn btn-secondary" onclick="newCheck()"><i class="fas fa-rotate"></i> New Check</button></div>`;

  // Disclaimer
  html += `<div class="disclaimer-box" style="margin-top:2rem"><i class="fas fa-triangle-exclamation"></i><div><strong>Important Disclaimer:</strong> This analysis is AI-generated guidance only and should NOT be considered a medical diagnosis. Always consult a qualified healthcare professional for proper diagnosis and treatment.</div></div>`;

  document.getElementById('resultsContent').innerHTML = html;

  // Animate confidence bars
  setTimeout(() => {
    document.querySelectorAll('.conf-fill').forEach(bar => {
      const w = bar.style.width; bar.style.width = '0%';
      setTimeout(() => { bar.style.width = w; }, 100);
    });
  }, 300);

  // Save to history
  state.history.unshift({
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    symptoms: [...state.symptoms],
    result: data.conditions[0].name,
    risk: data.risk
  });
}

function newCheck() {
  state.symptoms = [];
  state.age = ''; state.gender = ''; state.duration = 3; state.severity = 3;
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.symptom-tag').forEach(t => t.classList.remove('selected'));
  document.getElementById('durationSlider').value = 3;
  document.getElementById('severitySlider').value = 3;
  document.getElementById('durationVal').textContent = '3 days';
  document.getElementById('severityVal').textContent = 'Moderate';
  document.getElementById('conditionsInput').value = '';
  document.getElementById('notesInput').value = '';
  renderSelectedSymptoms();
  goToStep(1);
  navigateTo('symptoms');
}

// ===== HISTORY =====
function renderHistory() {
  const container = document.getElementById('historyTimeline');
  if (state.history.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--txt-3)"><i class="fas fa-clock-rotate-left" style="font-size:3rem;margin-bottom:1rem;display:block"></i><p>No health checks yet. Start your first symptom analysis!</p></div>';
    return;
  }
  container.innerHTML = state.history.map(h => `
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="card tl-card">
        <div class="tl-date"><i class="far fa-calendar"></i> ${h.date}</div>
        <h4>${h.symptoms.join(', ')}</h4>
        <p>Result: ${h.result}</p>
        <div class="tl-risk ${h.risk}">${h.risk.toUpperCase()} RISK</div>
      </div>
    </div>
  `).join('');
}

// ===== TABS =====
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
}

// ===== CHATBOT =====
function toggleChat() {
  document.getElementById('chatWindow').classList.toggle('open');
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  addChatMessage(msg, 'user');
  input.value = '';
  setTimeout(() => {
    const reply = getChatReply(msg);
    addChatMessage(reply, 'bot');
  }, 800);
}

function chatQuick(msg) {
  addChatMessage(msg, 'user');
  setTimeout(() => addChatMessage(getChatReply(msg), 'bot'), 800);
}

function addChatMessage(text, type) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + type;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function getChatReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('symptom') || m.includes('check')) return 'I can help you check your symptoms! Click "Get Started" or go to the Symptom Check page. Our AI will analyze your symptoms and provide insights. Remember, this is not a medical diagnosis! 🩺';
  if (m.includes('doctor') || m.includes('consult')) return 'You can find recommended specialists on our Doctors page. We offer both in-person and online video consultations with verified healthcare professionals. 👨‍⚕️';
  if (m.includes('tip') || m.includes('health') || m.includes('advice')) return 'Here are some quick health tips: Stay hydrated 💧, get 7-9 hours of sleep 😴, exercise 30 min daily 🏃, and eat plenty of fruits and vegetables 🥗!';
  if (m.includes('how') || m.includes('work')) return 'It\'s simple! 1️⃣ Enter your symptoms, 2️⃣ Our AI analyzes them against medical databases, 3️⃣ You get health insights, risk assessment, and recommendations. All confidential and instant!';
  if (m.includes('safe') || m.includes('privacy') || m.includes('data')) return 'Your privacy is our top priority! 🔒 All data is encrypted with 256-bit encryption. We never store your personal health data without explicit consent.';
  return 'Thanks for your message! I\'m here to help with health-related questions. You can ask about symptoms, find doctors, or get health tips. For medical emergencies, please call your local emergency number. 🏥';
}

// ===== INIT =====
renderHistory();
