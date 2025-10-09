import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["price", "tax", "profit"]

  connect() {

  }

  calculate() {
    const inputValue = parseInt(this.priceTarget.value)

    if (isNaN(inputValue) || inputValue < 1) {
      this.taxTarget.textContent = ""
      this.profitTarget.textContent = ""
      return
    }

    const tax = Math.floor(inputValue * 0.1)
    const profit = inputValue - tax

    this.taxTarget.textContent = tax.toLocaleString()
    this.profitTarget.textContent = profit.toLocaleString()
  }
}
