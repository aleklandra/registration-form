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
  return /^\+7[0-9]{10}$/.test(value);
}

function getPasswordStrength(value) {
  if (value.length === 0) return 0;

  let score = 0;
  if (value.length >= 8) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^\p{L}\p{N}\s]/u.test(value)) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;

  if (score <= 1) return 1;
  if (score <= 2) return 2;
  return 3;
}

function isPasswordValid(value) {
  return value.length >= 8 && (/[0-9]/.test(value) || /[^\p{L}\p{N}\s]/u.test(value));
}

function doPasswordsMatch(password, confirm) {
  return password === confirm && confirm.length > 0;
}

function updateStrengthUI(value) {
  const strength = getPasswordStrength(value);
  const widths = ['0%', '33%', '66%', '100%'];
  const colors = ['#eaeaea', '#e5484d', '#f5a623', '#1a7f37'];
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
}

function setError(input, error, message) {
  if (message) {
    input.setAttribute('aria-invalid', 'true');
  } else {
    input.removeAttribute('aria-invalid');
  }
  if (error.textContent !== message) {
    error.textContent = message;
  }
}

phoneInput.addEventListener('input', () => {
  if (phoneInput.value.length === 0) {
    setError(phoneInput, phoneError, '');
  } else if (!validatePhone(phoneInput.value)) {
    setError(phoneInput, phoneError, 'Введите номер в формате +7XXXXXXXXXX (11 цифр)');
  } else {
    setError(phoneInput, phoneError, '');
  }
  updateSubmitButtonState();
});

passwordInput.addEventListener('input', () => {
  updateStrengthUI(passwordInput.value);

  if (passwordInput.value.length === 0) {
    setError(passwordInput, passwordError, '');
  } else if (!isPasswordValid(passwordInput.value)) {
    setError(passwordInput, passwordError, 'Пароль слишком слабый: минимум 8 символов, добавьте цифры или спецсимволы');
  } else {
    setError(passwordInput, passwordError, '');
  }

  if (confirmInput.value.length > 0) {
    setError(confirmInput, confirmError, doPasswordsMatch(passwordInput.value, confirmInput.value)
      ? ''
      : 'Пароли не совпадают');
  }

  updateSubmitButtonState();
});

confirmInput.addEventListener('input', () => {
  if (confirmInput.value.length === 0) {
    setError(confirmInput, confirmError, '');
  } else if (!doPasswordsMatch(passwordInput.value, confirmInput.value)) {
    setError(confirmInput, confirmError, 'Пароли не совпадают');
  } else {
    setError(confirmInput, confirmError, '');
  }
  updateSubmitButtonState();
});

[[phoneInput, phoneError], [passwordInput, passwordError], [confirmInput, confirmError]]
  .forEach(([input, error]) => {
    input.addEventListener('blur', () => {
      if (input.value.length === 0) {
        setError(input, error, 'Обязательное поле');
      }
    });
  });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (isFormValid()) {
    form.parentElement.style.minHeight = `${form.parentElement.getBoundingClientRect().height}px`;
    form.hidden = true;
    successMessage.textContent = 'Поздравляем, вы зарегистрированы!';
    successMessage.hidden = false;
  }
});

updateSubmitButtonState();
