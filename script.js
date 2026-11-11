const form = document.getElementById('signupForm');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');

const phoneError = document.getElementById('phoneError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');
const successMessage = document.getElementById('successMessage');

const strengthBar = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');

function validatePhone(value) {
  const digitsOnly = value.replace(/\D/g, '');
  const isValidLength = digitsOnly.length === 11;
  const startsCorrectly = digitsOnly.startsWith('7') || digitsOnly.startsWith('8');
  return isValidLength && startsCorrectly;
}

function getPasswordStrength(value) {
  if (value.length === 0) return 0;

  let score = 0;
  if (value.length >= 8) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^a-zA-Z0-9]/.test(value)) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;

  if (score <= 1) return 1;
  if (score <= 2) return 2;
  return 3;
}

function isPasswordValid(value) {
  return getPasswordStrength(value) >= 2 && value.length >= 8;
}

function doPasswordsMatch(password, confirm) {
  return password === confirm && confirm.length > 0;
}

function updateStrengthUI(value) {
  const strength = getPasswordStrength(value);
  const widths = ['0%', '33%', '66%', '100%'];
  const colors = ['#514959', '#ff9aab', '#eaa2fd', '#d5ff70'];
  const labels = ['', 'Слабый', 'Средний', 'Сильный'];

  strengthBar.style.width = widths[strength];
  strengthBar.style.background = colors[strength];
  strengthLabel.textContent = labels[strength];
}

function isFormValid() {
  const phoneOk = validatePhone(phoneInput.value);
  const passwordOk = isPasswordValid(passwordInput.value);
  const confirmOk = doPasswordsMatch(passwordInput.value, confirmInput.value);
  return phoneOk && passwordOk && confirmOk;
}

function updateSubmitButtonState() {
  submitBtn.disabled = !isFormValid();
  for (const [input, error] of [[phoneInput, phoneError], [passwordInput, passwordError], [confirmInput, confirmError]]) {
    input.setAttribute('aria-invalid', String(Boolean(error.textContent)));
  }
}

phoneInput.addEventListener('input', () => {
  successMessage.textContent = '';
  if (phoneInput.value.length === 0) {
    phoneError.textContent = '';
  } else if (!validatePhone(phoneInput.value)) {
    phoneError.textContent = 'Введите номер в формате +7XXXXXXXXXX (11 цифр)';
  } else {
    phoneError.textContent = '';
  }
  updateSubmitButtonState();
});

passwordInput.addEventListener('input', () => {
  successMessage.textContent = '';
  updateStrengthUI(passwordInput.value);

  if (passwordInput.value.length === 0) {
    passwordError.textContent = '';
  } else if (!isPasswordValid(passwordInput.value)) {
    passwordError.textContent = 'Пароль слишком слабый: минимум 8 символов, добавьте цифры или спецсимволы';
  } else {
    passwordError.textContent = '';
  }

  if (confirmInput.value.length > 0) {
    confirmError.textContent = doPasswordsMatch(passwordInput.value, confirmInput.value)
      ? ''
      : 'Пароли не совпадают';
  }

  updateSubmitButtonState();
});

confirmInput.addEventListener('input', () => {
  successMessage.textContent = '';
  if (confirmInput.value.length === 0) {
    confirmError.textContent = '';
  } else if (!doPasswordsMatch(passwordInput.value, confirmInput.value)) {
    confirmError.textContent = 'Пароли не совпадают';
  } else {
    confirmError.textContent = '';
  }
  updateSubmitButtonState();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (isFormValid()) {
    successMessage.textContent = 'Регистрация прошла успешно!';
    celebrate(42);
  }
});

updateSubmitButtonState();

const motionToggle = document.getElementById('motionToggle');
const catButton = document.getElementById('catButton');
const catMessage = document.getElementById('catMessage');
const particles = document.getElementById('particles');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled = !motionPreference.matches;
let lastBurst = 0;
let petCount = 0;

function updateMotion() {
  motionEnabled = motionEnabled && !motionPreference.matches;
  document.body.classList.toggle('no-motion', !motionEnabled);
  motionToggle.setAttribute('aria-pressed', String(motionEnabled));
  motionToggle.textContent = motionEnabled ? 'Анимации: вкл.' : 'Анимации: выкл.';
  if (!motionEnabled) particles.replaceChildren();
}

motionToggle.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  updateMotion();
});
motionPreference.addEventListener('change', (event) => {
  motionEnabled = !event.matches;
  updateMotion();
});

function celebrate(count) {
  if (!motionEnabled || motionPreference.matches || Date.now() - lastBurst < 500) return;
  lastBurst = Date.now();
  const symbols = ['✦', '✳', '🐈', '✧', '🐾'];
  const colors = ['#d5ff70', '#eaa2fd', '#f6f3ef'];
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = symbols[i % symbols.length];
    particle.style.color = colors[i % colors.length];
    particle.style.setProperty('--x', `${(Math.random() - 0.5) * window.innerWidth * 1.5}px`);
    particle.style.setProperty('--y', `${(Math.random() - 0.65) * window.innerHeight * 1.5}px`);
    particle.style.setProperty('--r', `${(Math.random() - 0.5) * 720}deg`);
    particles.append(particle);
    window.setTimeout(() => particle.remove(), 1600);
  }
}

catButton.addEventListener('click', () => {
  petCount++;
  catMessage.textContent = `Мур! Кота погладили: ${petCount}.`;
  celebrate(12);
});
for (const input of [passwordInput, confirmInput]) {
  input.addEventListener('focus', () => document.body.classList.add('password-focus'));
  input.addEventListener('blur', () => document.body.classList.remove('password-focus'));
}
updateMotion();
