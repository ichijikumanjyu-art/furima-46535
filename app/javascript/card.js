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

  const errorBox = document.getElementById('card-errors');
  const setError = (message) => {
    if (errorBox) {
      errorBox.textContent = message || 'カード情報が正しくありません';
      errorBox.style.display = 'block';
    }
  };
  const clearError = () => {
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.style.display = 'none';
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    clearError();
    submit.disabled = true;
    payjp.createToken(numberElement).then((response) => {
      if (response.error) {
        setError(response.error.message);
        submit.disabled = false;
      } else {
        const token = response.id;
        const tokenField = document.getElementById('card-token');
        tokenField.value = token;
        const form = document.getElementById('charge-form');
        form.submit();
      }
    }).catch((err) => {
      setError('通信エラーが発生しました。時間をおいて再度お試しください。');
      console.error('[card.js] createToken failed', err);
      submit.disabled = false;
    });
  };

  submit.addEventListener('click', onSubmit);
};

window.addEventListener("turbo:load", pay);
window.addEventListener("turbo:render", pay);