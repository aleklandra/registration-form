const form = document.getElementById('signupForm');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');

const phoneError = document.getElementById('phoneError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');
const successMessage = document.getElementById('successMessage');

const passwordRequirements = document.getElementById('passwordRequirements');
const lengthRequirement = document.getElementById('lengthRequirement');
const digitRequirement = document.getElementById('digitRequirement');
const specialRequirement = document.getElementById('specialRequirement');

function validatePhone(value) {
  return /^\+7[0-9]{10}$/.test(value);
}

function hasDigit(value) {
  return /[0-9]/.test(value);
}

function hasSpecialCharacter(value) {
  return /[^\p{L}\p{N}\s]/u.test(value);
}

function isPasswordValid(value) {
  return value.length >= 8 && hasDigit(value) && hasSpecialCharacter(value);
}

function doPasswordsMatch(password, confirm) {
  return password === confirm && confirm.length > 0;
}

function updateStrengthUI(value) {
  passwordRequirements.hidden = value.length === 0;
  [[lengthRequirement, value.length >= 8], [digitRequirement, hasDigit(value)], [specialRequirement, hasSpecialCharacter(value)]]
    .forEach(([requirement, fulfilled]) => {
      requirement.classList.toggle('fulfilled', fulfilled);
      requirement.querySelector('.requirement-icon').textContent = fulfilled ? '✓' : '✕';
      requirement.querySelector('.requirement-status').textContent = fulfilled ? ' — выполнено' : ' — не выполнено';
    });
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

  setError(passwordInput, passwordError, '');
  if (passwordInput.value.length > 0 && !isPasswordValid(passwordInput.value)) {
    passwordInput.setAttribute('aria-invalid', 'true');
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

[[phoneInput, phoneError], [confirmInput, confirmError]]
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
