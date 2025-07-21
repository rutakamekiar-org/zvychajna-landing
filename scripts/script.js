const CHECKOUT_API_URL = "https://bookpreorder.onrender.com/api/checkout";
const INVOICE_API_URL =
  "https://skylark-brief-uniquely.ngrok-free.app/api/invoice";
document
  .getElementById("preorder_button")
  .addEventListener("click", async () => {
    try {
      const response = await fetch(CHECKOUT_API_URL, {
        method: "POST",
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Не вдалося отримати посилання на оплату.");
      }
    } catch (error) {
      console.error("POST помилка:", error);
      alert(
        "Сервер зараз недоступний. Спробуйте ще раз за кілька хвилин."
      );
    }
  });
document
  .getElementById("invoice_button")
  .addEventListener("click", async () => {
    try {
      const response = await fetch(INVOICE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: "vladkovaliov13@gmail.com",
          productId: "c1f3c4a6-f4b1-4351-9b83-5b4b4be48896",
        }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Не вдалося отримати посилання на оплату.");
      }
    } catch (error) {
      console.error("POST помилка:", error);
      alert(
        "Сервер зараз недоступний. Спробуйте ще раз за кілька хвилин."
      );
    }
  });