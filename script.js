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
  return /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(value);
}

function formatPhone(digits) {
  const number = digits.slice(0, 10);
  let formatted = '+7';
  if (number.length > 0) formatted += '(' + number.slice(0, 3);
  if (number.length >= 3) formatted += ')';
  if (number.length > 3) formatted += number.slice(3, 6);
  if (number.length > 6) formatted += '-' + number.slice(6, 8);
  if (number.length > 8) formatted += '-' + number.slice(8, 10);
  return formatted;
}

function formatPhoneInput() {
  const value = phoneInput.value;
  if (!value) return;
  const caret = phoneInput.selectionStart;
  const digits = value.replace(/\D/g, '');
  const hasPrefix = value.startsWith('+7');
  const number = hasPrefix ? digits.slice(1) : digits;
  const digitsBeforeCaret = value.slice(0, caret).replace(/\D/g, '').length - (hasPrefix ? 1 : 0);
  const formatted = formatPhone(number);
  phoneInput.value = formatted;

  if (caret === value.length) {
    phoneInput.setSelectionRange(formatted.length, formatted.length);
  } else {
    let position = 2;
    let remaining = Math.max(0, digitsBeforeCaret);
    while (position < formatted.length && remaining > 0) {
      if (/[0-9]/.test(formatted[position])) remaining--;
      position++;
    }
    phoneInput.setSelectionRange(position, position);
  }
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

phoneInput.addEventListener('focus', () => {
  if (!phoneInput.value) phoneInput.value = '+7';
});

phoneInput.addEventListener('beforeinput', (event) => {
  if (!['deleteContentBackward', 'deleteContentForward'].includes(event.inputType)) return;
  const start = phoneInput.selectionStart;
  const end = phoneInput.selectionEnd;
  if (start !== end) return;
  const backward = event.inputType === 'deleteContentBackward';
  let position = backward ? start - 1 : start;
  if (position < 2 || position >= phoneInput.value.length || /[0-9]/.test(phoneInput.value[position])) return;
  while (position >= 2 && position < phoneInput.value.length && !/[0-9]/.test(phoneInput.value[position])) {
    position += backward ? -1 : 1;
  }
  if (position < 2 || position >= phoneInput.value.length) return;
  event.preventDefault();
  phoneInput.setRangeText('', position, position + 1, 'start');
  phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
});

phoneInput.addEventListener('paste', (event) => {
  const digits = event.clipboardData.getData('text').replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    event.preventDefault();
    phoneInput.value = formatPhone(digits.slice(1));
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
});

phoneInput.addEventListener('input', () => {
  formatPhoneInput();
  if (phoneInput.value.length === 0) {
    setError(phoneInput, phoneError, '');
  } else if (!validatePhone(phoneInput.value)) {
    setError(phoneInput, phoneError, 'Введите номер в формате +7(XXX)XXX-XX-XX');
  } else {
    setError(phoneInput, phoneError, '');
  }
  updateSubmitButtonState();
});

phoneInput.addEventListener('blur', () => {
  if (phoneInput.value === '+7') phoneInput.value = '';
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
