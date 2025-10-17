const pay = () => {
  const publicKey = gon.public_key;
  if (!publicKey || typeof Payjp === 'undefined') {
    return;
  }
  const payjp = Payjp(publicKey); // PAY.JPテスト公開鍵
  const elements = payjp.elements();

  const numberForm = document.getElementById('number-form');
  if (!numberForm) {
      return; 
  }

  const numberElement = elements.create('cardNumber');
  numberElement.mount('#number-form');

  const expiryElement = elements.create('cardExpiry');
  expiryElement.mount('#expiry-form');

  const cvcElement = elements.create('cardCvc');
  cvcElement.mount('#cvc-form');

  const submit = document.getElementById("button");
  if (!submit) return;

  submit.addEventListener("click", (e) => {
    e.preventDefault();

    payjp.createToken(numberElement).then((response) => {
      if (response.error) {
        alert("カード情報が正しくありません");
      } else {
        const token = response.id;

        
        const tokenField = document.getElementById("card-token"); 
        tokenField.value = token;

      
        const form = document.getElementById("charge-form");
        form.submit();
      }
    });
  });
};

window.addEventListener("turbo:load", pay);
window.addEventListener("turbo:render", pay);