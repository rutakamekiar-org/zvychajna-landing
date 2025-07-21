document.addEventListener("DOMContentLoaded", () => {
    // API URLs
    const CHECKOUT_API_URL = "https://bookpreorder.onrender.com/api/checkout";
    const INVOICE_API_URL =
      "https://skylark-brief-uniquely.ngrok-free.app/api/invoice";
  
    // Drawer elements
    const drawer = document.getElementById("drawer_cart");
    const overlay = document.getElementById("drawer_overlay");
    const drawerContent = document.getElementById("drawer_content");
    const closeDrawerBtn = document.getElementById("close_drawer_btn");
  
    // Main page buttons
    const preorderBtn = document.getElementById("preorder_button");
    const invoiceBtn = document.getElementById("invoice_button");
  
    const openDrawer = (type) => {
      populateDrawer(type);
      overlay.style.display = "block";
      drawer.classList.add("open");
    };
  
    const closeDrawer = () => {
      drawer.classList.remove("open");
      overlay.style.display = "none";
    };
  
    const populateDrawer = (type) => {
      let contentHTML = "";
      if (type === "paper") {
        contentHTML = `
          <div class="drawer-product-details">
            <img src="images/book.jpg" alt="Паперова версія" />
            <h4>Звичайна: Паперова версія</h4>
            <p>350 грн</p>
          </div>
          <div class="drawer-form-group">
            <label for="quantity">Кількість:</label>
            <input type="number" id="quantity" value="1" min="1" />
          </div>
          <div class="drawer-purchase-button-container">
            <img src="images/monocheckout_button_black_normal.svg" id="drawer_purchase_paper" alt="Замовити" />
          </div>
        `;
      } else if (type === "digital") {
        contentHTML = `
          <div class="drawer-product-details">
            <img src="images/book.jpg" alt="Електронна версія" />
            <h4>Звичайна: Електронна версія</h4>
            <p>200 грн</p>
          </div>
          <div class="drawer-form-group">
            <label for="customer_email">Ваш Email:</label>
            <input type="email" id="customer_email" placeholder="email@example.com" required />
          </div>
          <div class="drawer-form-group">
            <label for="customer_phone">Ваш телефон:</label>
            <input type="tel" id="customer_phone" placeholder="+380XXXXXXXXX" required />
          </div>
          <div class="drawer-purchase-button-container">
            <img src="images/monocheckout_button_black_normal.svg" id="drawer_purchase_digital" alt="Замовити" />
          </div>
        `;
      }
  
      drawerContent.innerHTML = contentHTML;
  
      // Add event listeners to the newly created buttons inside the drawer
      if (type === "paper") {
        document
          .getElementById("drawer_purchase_paper")
          .addEventListener("click", handlePaperPurchase);
      } else if (type === "digital") {
        document
          .getElementById("drawer_purchase_digital")
          .addEventListener("click", handleDigitalPurchase);
      }
    };
  
    const handleApiRequest = async (url, options) => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
  
        if (response.ok) { // Check for successful response (status 2xx)
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                alert("Не вдалося отримати посилання на оплату.");
            }
        } else { // Handle API errors
            debugger
            if (data.errors) {
                for (const field in data.errors) {
                    if (data.errors.hasOwnProperty(field)) {
                        const errorMessage = data.errors[field][0]; // Get the first error message for the field
                        if (field === "CustomerEmail") {
                            alert("Будь ласка, введіть дійсну адресу електронної пошти.");
                        } else if (field === "CustomerPhone") {
                            alert("Будь ласка, введіть дійсний номер телефону.");
                        } else {
                            alert(`Помилка: ${errorMessage}`);
                        }
                    }
                }
            } else {
                alert(data.title || "Виникла невідома помилка.");
            }
        }
      } catch (error) {
        console.error("POST помилка:", error);
        alert("Сервер зараз недоступний. Спробуйте ще раз за кілька хвилин.");
      }
    };
  
    const handlePaperPurchase = () => {
      const quantity = document.getElementById("quantity").value;
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: parseInt(quantity, 10) }),
      };
      handleApiRequest(CHECKOUT_API_URL, options);
    };
  
    const handleDigitalPurchase = () => {
      const email = document.getElementById("customer_email").value;
      const phone = document.getElementById("customer_phone").value; 
      
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert("Будь ласка, введіть дійсну адресу електронної пошти.");
        return;
      }
      if (!phone || !/^\+?\d{10,14}$/.test(phone)) { 
        alert("Будь ласка, введіть дійсний номер телефону.");
        return;
      }

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          customerPhone: phone, 
          productId: "c1f3c4a6-f4b1-4351-9b83-5b4b4be48896",
        }),
      };
      handleApiRequest(INVOICE_API_URL, options);
    };
  
    // Event Listeners
    preorderBtn.addEventListener("click", () => openDrawer("paper"));
    invoiceBtn.addEventListener("click", () => openDrawer("digital"));
    closeDrawerBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);
  });