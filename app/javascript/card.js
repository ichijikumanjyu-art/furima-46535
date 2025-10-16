document.addEventListener('DOMContentLoaded', () => {
  const publicKey = gon.public_key
  const payjp = Payjp(publicKey) // PAY.JPテスト公開鍵
  const elements = payjp.elements();

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
        console.log(response.error.message);
      } else {
        console.log("トークン生成成功");
        const token = response.id;

        
        const tokenField = document.getElementById("card-token"); 
        tokenField.value = token;

      
        const form = document.getElementById("charge-form");
        form.submit();
      }
    });
  });
});