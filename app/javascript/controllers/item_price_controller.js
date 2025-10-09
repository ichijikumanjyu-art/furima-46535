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

window.addEventListener("turbo:load", price);
window.addEventListener("turbo:render", price);
