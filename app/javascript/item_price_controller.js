const price = () => {
  const priceInput = document.getElementById("item-price");
  const taxDisplay = document.getElementById("add-tax-price");
  const profitDisplay = document.getElementById("profit");

  if (!priceInput) return;

  priceInput.addEventListener("input", () => {
    const inputValue = parseInt(priceInput.value);

    if (isNaN(inputValue) || inputValue < 1) {
      taxDisplay.textContent = "";
      profitDisplay.textContent = "";
      return;
    }

    const tax = Math.floor(inputValue * 0.1);
    const profit = inputValue - tax;

    taxDisplay.textContent = tax.toLocaleString();
    profitDisplay.textContent = profit.toLocaleString();
  });

  const initialValue = parseInt(priceInput.value);
  if (!isNaN(initialValue)) {
    const tax = Math.floor(initialValue * 0.1);
    const profit = initialValue - tax;
    taxDisplay.textContent = tax.toLocaleString();
    profitDisplay.textContent = profit.toLocaleString();
  }
};

const payjpToken = () => {
  const form = document.getElementById('charge-form');
  if (!form) {
    console.log('Form not found');
    return;
  }

  // Avoid duplicate initialization on Turbo navigations
  if (form.dataset.payjpInitialized === 'true') {
    console.log('PAY.JP already initialized');
    return;
  }
  form.dataset.payjpInitialized = 'true';

  // PAY.JPの公開鍵を設定（gonまたはmetaタグから取得）
  const publicKey = window.gon?.public_key || document.querySelector('meta[name="payjp-public-key"]')?.getAttribute('content');
  console.log('Public key:', publicKey);
  if (!publicKey) {
    console.warn('PAY.JP public key is missing. Skipping card initialization.');
    return;
  }
  
  if (typeof Payjp === 'undefined') {
    console.error('PAY.JP library not loaded');
    return;
  }
  
  // Check if Payjp is already initialized
  if (window.payjpInstance) {
    console.log('PAY.JP already initialized globally');
    return;
  }
  
  const payjp = Payjp(publicKey);
  window.payjpInstance = payjp;
  
  // カード情報入力フィールドを初期化
  const elements = payjp.elements();
  const numberElement = elements.create('cardNumber');
  const expiryElement = elements.create('cardExpiry');
  const cvcElement = elements.create('cardCvc');

  try {
    numberElement.mount('#number-form');
    console.log('Card number element mounted');
  } catch (e) {
    console.error('Failed to mount card number:', e);
  }
  
  try {
    expiryElement.mount('#expiry-form');
    console.log('Card expiry element mounted');
  } catch (e) {
    console.error('Failed to mount card expiry:', e);
  }
  
  try {
    cvcElement.mount('#cvc-form');
    console.log('Card CVC element mounted');
  } catch (e) {
    console.error('Failed to mount card CVC:', e);
  }

  console.log('PAY.JP Elements mounted');

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("フォーム送信イベントが発火しました");

    // カード情報をPAY.JPに送信してトークンを生成
    payjp.createToken(numberElement).then(function (response) {
      console.log("PAY.JPからのレスポンス:", response);
      
      if (response.error) {
        console.log("エラーが発生しました:", response.error);
        return;
      }

      // トークンが正常に生成された場合
      console.log("トークンが生成されました:", response.id);
      
      // トークンをサーバーサイドに送信するためのhidden inputを生成
      const token = response.id;
      const tokenObj = `<input value=${token} name='token' type="hidden">`;
      
      // フォームにトークンを追加
      form.insertAdjacentHTML("beforeend", tokenObj);
      
      // フォームを実際に送信
      form.submit();
    });
  });
};

window.addEventListener("turbo:load", () => {
  price();
  payjpToken();
});
window.addEventListener("turbo:render", () => {
  price();
  payjpToken();
});
