const pay = () => {
  const numberForm = document.getElementById('number-form');
  if (!numberForm) {
    return;
  }
  if (numberForm.dataset.mounted === 'true') {
    return;
  }

  let publicKey = typeof gon !== 'undefined' ? gon.public_key : null;
  if (!publicKey) {
    const meta = document.querySelector('meta[name="payjp-public-key"]');
    publicKey = meta && meta.content;
  }
  if (!publicKey || typeof Payjp === 'undefined') {
    console.debug('[card.js] Skip init: missing publicKey or Payjp');
    return;
  }

  const payjp = Payjp(publicKey);
  const elements = payjp.elements();

  let numberElement, expiryElement, cvcElement;
  try {
    numberElement = elements.create('cardNumber');
    numberElement.mount('#number-form');
    console.debug('[card.js] Mounted cardNumber');
  } catch (e) {
    console.error('[card.js] Failed to mount cardNumber', e);
    return;
  }

  try {
    expiryElement = elements.create('cardExpiry');
    expiryElement.mount('#expiry-form');
    console.debug('[card.js] Mounted cardExpiry');
  } catch (e) {
    console.error('[card.js] Failed to mount cardExpiry', e);
  }

  try {
    cvcElement = elements.create('cardCvc');
    cvcElement.mount('#cvc-form');
    console.debug('[card.js] Mounted cardCvc');
  } catch (e) {
    console.error('[card.js] Failed to mount cardCvc', e);
  }

  // マウント済みフラグ（Turbo再描画時の二重マウント防止）
  numberForm.dataset.mounted = 'true';

  const submit = document.getElementById('button');
  if (!submit) return;

  // 画像直下（#errors-anchor）に共有エラーブロックを設置（存在しなければ作成）
  const ensureSharedErrorBox = () => {
    let alertBox = document.querySelector('#errors-anchor .error-alert') || document.querySelector('.error-alert');
    if (!alertBox) {
      const anchor = document.getElementById('errors-anchor');
      alertBox = document.createElement('div');
      alertBox.className = 'error-alert';
      const ul = document.createElement('ul');
      alertBox.appendChild(ul);
      if (anchor) {
        anchor.innerHTML = '';
        anchor.appendChild(alertBox);
      } else {
        const form = document.getElementById('charge-form');
        if (!form || !form.parentNode) return null;
        form.parentNode.insertBefore(alertBox, form);
      }
    }
    if (!alertBox.querySelector('ul')) {
      const ul = document.createElement('ul');
      alertBox.appendChild(ul);
    }
    return alertBox;
  };

  const setError = (message) => {
    const alertBox = ensureSharedErrorBox();
    if (!alertBox) return;
    const ul = alertBox.querySelector('ul');
    ul.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'error-message';
    li.textContent = message || 'カード情報が正しくありません';
    ul.appendChild(li);
    alertBox.classList.add('is-visible');
    try { window.scrollTo({ top: Math.max(alertBox.offsetTop - 80, 0), behavior: 'smooth' }); } catch (e) {}
  };

  const clearError = () => {
    const alertBox = document.querySelector('.error-alert');
    if (!alertBox) return;
    const ul = alertBox.querySelector('ul');
    if (ul) ul.innerHTML = '';
    alertBox.classList.remove('is-visible');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    clearError();
    submit.disabled = true;
    payjp.createToken(numberElement).then((response) => {
      if (response.error) {
        // サーバ側のエラーレンダリングに統合するため、hiddenに格納してフォーム送信
        const cardErrorField = document.getElementById('card-error');
        if (cardErrorField) {
          cardErrorField.value = response.error.message || 'Card error';
        }
        const form = document.getElementById('charge-form');
        form.submit();
      } else {
        const token = response.id;
        const tokenField = document.getElementById('card-token');
        tokenField.value = token;
        const form = document.getElementById('charge-form');
        form.submit();
      }
    }).catch((err) => {
      const cardErrorField = document.getElementById('card-error');
      if (cardErrorField) {
        cardErrorField.value = 'Network error. Please try again.';
      }
      const form = document.getElementById('charge-form');
      form.submit();
    });
  };

  submit.addEventListener('click', onSubmit);
};

window.addEventListener("turbo:load", pay);
window.addEventListener("turbo:render", pay);