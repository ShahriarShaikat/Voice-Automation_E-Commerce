async function getCartCount() {
  let response = await fetch(`/cart/count`);
  const result = await response.json();
  switch (response.status) {
    case 200:
      document.getElementById("cart-count").innerHTML = result.count || 0;
      break;
    case 401:
      document.getElementById("cart-count").innerHTML = 0;
      break;

    default:
      break;
  }
}

async function addToCart(id) {
  let response = await fetch(`/cart/add-to-cart/${id}`);
  const result = await response.json();
  switch (response.status) {
    case 200:
      if (window.location.href.trim().includes("cart")) {
        getCartDetails();
      }
      getCartCount();
      Toastify({
        text: result.message,
        duration: 1000,
      }).showToast();
      break;
    case 401:
      Toastify({
        text: "You need to login first!",
        duration: 1000,
      }).showToast();
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      break;

    default:
      break;
  }
}

async function increaseDecreaseQTY(id, event, flag) {
  let values = flag ? flag : event.value;
  let response = await fetch(`/cart/quantity/${id}/${values}`);
  if (response.status == 200) {
    const { message } = await response.json();
    if (window.location.href.trim().includes("cart")) {
      getCartDetails();
    }
    getCartCount();
    Toastify({
      text: message,
      duration: 2000,
    }).showToast();
  } else if (response.status == 404) {
    const { message } = await response.json();
    Toastify({
      text: message,
      duration: 2000,
    }).showToast();
  }
}

async function getCartDetails() {
  let response = await fetch(`/cart/get-details`);

  if (response.status == 200) {
    const tBODY = document.getElementById("card-details-body");
    const { cart, user } = await response.json();
    if (cart.length > 0) {
      tBODY.innerHTML = "";
      const cartObj = cart.map((p) => ({
        ...p,
        subtotal: p.price * p.qty,
      }));
      const subtotal = cartObj.reduce((rs, p) => rs + p.subtotal, 0);
      cartObj.forEach((p) => {
        const TR = document.createElement("tr");
        const TD1 = document.createElement("td");
        const TD2 = document.createElement("td");
        const TD3 = document.createElement("td");
        const TD4 = document.createElement("td");
        const TD5 = document.createElement("td");
        const TD6 = document.createElement("td");

        const input = document.createElement("input");
        input.type = "number";
        input.value = p.qty;
        input.onchange = function () {
          increaseDecreaseQTY(p._id, input, undefined);
        };

        TD1.innerHTML = `<a onclick="removeProductFromCart('${p._id}')"><i class="far fa-times-circle"></i></a>`;

        TD2.innerHTML = `<img src="img/products/${p.avatar}" alt="" />`;

        TD3.innerHTML = p.name;

        TD4.innerHTML = `$${p.price}`;

        TD5.appendChild(input);

        TD6.innerHTML = `$${p.subtotal}`;

        TR.appendChild(TD1);
        TR.appendChild(TD2);
        TR.appendChild(TD3);
        TR.appendChild(TD4);
        TR.appendChild(TD5);
        TR.appendChild(TD6);
        tBODY.appendChild(TR);
      });

      document.getElementById("cart-add").style.display = "flex";
      document.getElementById("cart-subtotal").innerHTML = `$${subtotal}`;
      document.getElementById("cart-total").innerHTML = `$${subtotal}`;
    } else {
      document.getElementById("cart-add").style.display = "none";
      tBODY.innerHTML = `<tr>
      <td colspan="6" style="font-size: 16px;padding-bottom: 10px;border: 1px solid #e6e4e4;">
        No product found!
      </td>
    </tr>`;
    }
  }
}

async function removeProductFromCart(id) {
  let response = await fetch(`/cart/remove/${id}`);
  if (response.status == 200) {
    if (window.location.href.trim().includes("cart")) {
      getCartDetails();
    }
    getCartCount();
    Toastify({
      text: "Product removed!",
      duration: 2000,
    }).showToast();
  } else if (response.status === 404) {
    const { message } = await response.json();
    Toastify({
      text: message,
      duration: 2500,
    }).showToast();
  } else {
    Toastify({
      text: "Product remove failed!",
      duration: 2500,
    }).showToast();
  }
}
