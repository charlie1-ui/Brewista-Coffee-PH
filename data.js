//routes
const loginRoutes = "http://localhost:3000/login/";
const regRoutes = "http://localhost:3000/register/";
const newOrderRoutes = "http://localhost:3000/addOrder/";
//authuser
const userProfileName = document.getElementById("user-name");
const userIdNumber = document.getElementById("user-id");

const authUser = localStorage.getItem("currentUser");
const dataUser = JSON.parse(authUser);
if (authUser !== null) {
  userProfileName.textContent = dataUser.name;
  userIdNumber.textContent = `ID: ${dataUser.idNumber}`;
}

//error hadndler
const handleErrorMesage = (message) => {
  const errorMessage = document.getElementById("error-message");
  const messageContent = document.getElementById("error-message-content");
  errorMessage.style.display = "flex";
  messageContent.textContent = message;
};

//login/register
const profileCon = document.getElementById("profile-con");
const loginBox = document.getElementById("login-box");
const getCurrentUser = () => {
  const authUser = localStorage.getItem("currentUser");

  if (authUser === null) {
    loginBox.style.display = "block";
    profileCon.style.display = "none";
  }
};
getCurrentUser();

const loginButtonPres = document.getElementById("loginButton");
const regButtonPress = document.getElementById("regButton");

const clickReg = document.getElementById("click-reg");
const clickLogin = document.getElementById("click-login");
const loginForm = document.getElementById("field-input-login");
const regForm = document.getElementById("field-input-reg");
const headrTitle = document.getElementById("login-header-message");

const switchRegForm = () => {
  loginForm.style.display = "none";
  regForm.style.display = "flex";
  loginButtonPres.style.display = "none";
  regButtonPress.style.display = "block";
  clickReg.style.display = "none";
  clickLogin.style.display = "block";
  headrTitle.textContent = "Please register to order!";
};
const switchLoginForm = () => {
  loginForm.style.display = "flex";
  regForm.style.display = "none";
  loginButtonPres.style.display = "block";
  regButtonPress.style.display = "none";
  clickReg.style.display = "block";
  clickLogin.style.display = "none";
  headrTitle.textContent = "Please login to order!";
};
clickReg.addEventListener("click", switchRegForm);
clickLogin.addEventListener("click", switchLoginForm);
//calculation
const getPricing = (value) => {
  const priceList = JSON.parse(value);
  for (let item of Object.values(priceList)) {
    console.log("Check", item);
  }
};

//open Login modal
const loginButton = document.getElementById("login-button");
const loginModal = document.getElementById("login-order-overlay");
const openLoginModal = () => {
  loginModal.style.display = "flex";
  document.body.classList.add("no-scroll");
};
loginButton.addEventListener("click", openLoginModal);

const closeLoginModal = document.getElementById("login-close-modal");
const closeLoginBox = () => {
  loginModal.style.display = "none";
  document.body.classList.remove("no-scroll");
};
closeLoginModal.addEventListener("click", closeLoginBox);

//* <Request to login> */

const username = document.getElementById("username");
const password = document.getElementById("password");

const handleLogin = async () => {
  if (
    username.value === "" ||
    (username.value === undefined && password.value === "") ||
    password.value === undefined
  ) {
    handleErrorMesage("All field are required!");
    return;
  }

  try {
    const response = await fetch(loginRoutes, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    console.log(data.data);
    if (data?.message === "ok") {
      localStorage.setItem("currentUser", JSON.stringify(data?.data));
      location.reload();
      getCurrentUser();
      return;
    }
    handleErrorMesage(`Error: ${data?.message}`);
  } catch (error) {
    handleErrorMesage(`Error: ${error}`);
  }
};

loginButtonPres.addEventListener("click", handleLogin);

//* <Request to login> */

//Request to register
const regUsername = document.getElementById("reg-username");
const regPassword = document.getElementById("reg-password");
const fullname = document.getElementById("reg-fullname");
const contact = document.getElementById("contact");
const address = document.getElementById("contact");

const handleUserReg = async () => {
  if (
    regUsername.value === "" ||
    (regUsername.value === undefined && regPassword.value === "") ||
    (regPassword.value === undefined && fullname.value === "") ||
    (fullname.value === undefined && contact.value === "") ||
    (contact.value === undefined && address.value === "") ||
    address.value === undefined
  ) {
    handleErrorMesage("All fields are required!");
    return;
  }
  console.log(regUsername.value, regPassword.value);
  try {
    const response = await fetch(regRoutes, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: regUsername.value,
        password: regPassword.value,
        fullname: fullname.value,
        contact: contact.value,
        address: address.value,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      location.reload();
      localStorage.setItem("currentUser", JSON.stringify(data.data));
      return;
    }
    handleErrorMesage(data.message);
  } catch (error) {
    handleErrorMesage(`${error}`);
  }
};

regButtonPress.addEventListener("click", handleUserReg);
//Request to register

//Add order modal

const overlay = document.getElementById("add-order-overlay");
const addOrderCloseBtn = document.getElementById("add-order-close-button");

const closeModal = () => {
  overlay.style.display = "none";
  document.body.classList.remove("no-scroll");
};

addOrderCloseBtn.addEventListener("click", closeModal);

// overlay.addEventListener("click", closeModal);

const openAddOrderModal = (imgUrl, prices, itemName,priceType) => {
  const orderImageCon = document.getElementById("order-picture");
  const orderName = document.getElementById("order-name");
  const variantsList = document.getElementById("variants");
  const clickconfirm = document.getElementById("add-order-confirm");
  const quantity = document.getElementById("quantity")
  // Clear any existing options
  variantsList.innerHTML = "";

  const priceList = JSON.parse(prices);
  for (let item of Object.values(priceList)) {
    const data = item.split(":");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const priceLabel = document.createElement("label")
    priceLabel.textContent = data[1]

    input.setAttribute("value",data[1]);
    input.setAttribute("name", "variant");
    input.setAttribute("type", "radio");

    label.appendChild(input);
    label.appendChild(document.createTextNode(`${priceType ? data[0] : ""} ${priceType ?"-": ""} ₱ ${data[1]}`));
    variantsList.appendChild(label);

    input.addEventListener("change", updateSelectedValue);
  }

  quantity.addEventListener("change",updateSelectedValue)
  orderName.textContent = itemName;
  orderImageCon.style.backgroundImage = `url(${imgUrl})`;
  overlay.style.display = "flex";
  document.body.classList.add("no-scroll");

  clickconfirm.addEventListener("click", () => handleSendOrder(itemName));
};

function updateSelectedValue() {
  const selectedRadio = document.querySelector('input[name="variant"]:checked');
  const quantity = document.getElementById("quantity").value;
  const totalPay = document.getElementById("totalPay");

  if (selectedRadio && quantity) {
    const price = parseFloat(selectedRadio.value);
    const total = price * quantity;
    totalPay.value = total.toFixed(2);
  } else {
    totalPay.value = "";
  }
}

// Send order
const addCancelButton = document.getElementById("add-order-cancel");
addCancelButton.addEventListener("click", closeModal);

const handleSendOrder = async (itemName) => {
  const quantity = document.getElementById("quantity").value;
  const totalPay = document.getElementById("totalPay").value;

  if (!quantity || !totalPay) {
    handleErrorMesage("All fields are required!");
    return;
  }

  const authUser = localStorage.getItem("currentUser");
  const dataUser = JSON.parse(authUser);

  try {
    const response = await fetch(newOrderRoutes, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemName: itemName,
        customerName: dataUser.name,
        customerContact: dataUser.contact,
        customerID: dataUser.idNumber,
        curstomerAddress: dataUser.address,
        quantity: quantity,
        totalPrice: totalPay,
      }),
    });
    if (response.status === 200) {
      // Handle successful order submission here
    }
  } catch (error) {
    handleErrorMesage(`${error}`);
  }
};

//send order

fetch("menu.xml")
  .then((response) => response.text())
  .then((xmlString) => {
    const xmlDocs = new DOMParser().parseFromString(xmlString, "text/xml");
    const hots = xmlDocs.querySelectorAll("item[category='hot']");
    const menuList = document.querySelector(".hot-menu");

    if (menuList) {
      hots.forEach((item) => {
        const itemName = item.querySelector("name")?.textContent || "No name";
        const imageSrc = item.querySelector("imgSrc")?.textContent || "";
        const itemRating = item.querySelector("rating")?.textContent || "0.0";
        const menuItem = document.createElement("div");
        menuItem.setAttribute("class", "hot-item");

        const imgContainer = document.createElement("div");
        imgContainer.setAttribute("class", "img-container");

        const image = document.createElement("img");
        image.setAttribute("src", imageSrc);
        image.setAttribute("alt", itemName);

        imgContainer.appendChild(image);

        const hotName = document.createElement("div");
        hotName.setAttribute("class", "hot-name");

        const nameHeading = document.createElement("h1");
        nameHeading.textContent = itemName;

        hotName.appendChild(nameHeading);

        const rating = document.createElement("div");
        rating.setAttribute("class", "rating");

        const imgIcon = document.createElement("img");
        imgIcon.setAttribute("src", "./assets/star.png");
        imgIcon.setAttribute("alt", "rating");
        imgIcon.setAttribute("class", "star-icon");

        const ratingValue = document.createElement("h1");
        ratingValue.textContent = itemRating;

        rating.appendChild(imgIcon);
        rating.appendChild(ratingValue);

        menuItem.appendChild(imgContainer);
        menuItem.appendChild(hotName);
        menuItem.appendChild(rating);

        menuList.appendChild(menuItem);
      });
    } else {
      console.error("menuList element not found.");
    }
  })
  .catch((error) => {
    console.error("Error fetching or parsing XML:", error);
  });

let next = document.querySelector(".next");
let prev = document.querySelector(".prev");

next.addEventListener("click", function () {
  let items = document.querySelectorAll(".item");
  document.querySelector(".slide").appendChild(items[0]);
});

prev.addEventListener("click", function () {
  let items = document.querySelectorAll(".item");
  document.querySelector(".slide").prepend(items[items.length - 1]);
});

fetch("menu.xml")
  .then((response) => {
    return response.text();
  })
  .then((xmlString) => {
    const xmlDocs = new DOMParser().parseFromString(xmlString, "text/xml");
    const coffeeList = xmlDocs.querySelectorAll("item");
    const container = document.querySelector(".slide");

    coffeeList.forEach((item) => {
      const itemName = item.querySelector("name").textContent;
      const itemImageSrc = item.querySelector("imgSrc").textContent;
      const pricing = item.querySelector("pricing").textContent;
      const content = document.createElement("div");
      content.setAttribute("class", "content");

      const slideItem = document.createElement("div");
      slideItem.setAttribute("class", "item");
      slideItem.style.backgroundImage = `url(${itemImageSrc})`;

      const desc = document.createElement("div");
      desc.setAttribute("class", "des");
      desc.textContent = pricing;

      const buyButton = document.createElement("button");
      buyButton.setAttribute("class", "button");
      buyButton.innerText = "Buy now!";

      buyButton.addEventListener("click", () => {
        if (authUser === null) {
          openLoginModal();
          return;
        }
        openAddOrderModal(itemImageSrc, pricing, itemName,1);
      });

      const name = document.createElement("div");
      name.setAttribute("class", "name");
      name.textContent = itemName;

      slideItem.appendChild(content);
      content.appendChild(name);
      content.appendChild(desc);
      content.appendChild(buyButton);
      slideItem.appendChild(content);
      container.appendChild(slideItem);
    });
  });

const text = document.getElementById("cart");

const tryPress = document.getElementById("order");
const sideNav = document.getElementById("side-nav");
const mainContainer = document.getElementById("main-container");
tryPress.addEventListener("click", () => {
  sideNav.classList.toggle("active-nav");
  mainContainer.classList.toggle("active");
});

const navCloseButton = document.getElementById("nav-close-button");

navCloseButton.addEventListener("click", () => {
  sideNav.classList.remove("active-nav");
  mainContainer.classList.remove("active");
});

const getAllMainMenu = async()=>{
  try {
    const response = await fetch("menu.xml")
    const xmlString = await response.text();
    const xmlDocs = new DOMParser().parseFromString(xmlString, "text/xml")
    const mainMenus = xmlDocs.querySelectorAll("item[category='mainMenu']")
    
    const modifiers = document.getElementById("modifiers-list")
    const brSpecial = document.getElementById("brRpecial-list")

    mainMenus.forEach((item)=> {
      const itemName = item.querySelector("name").textContent;
      const itemImageSrc = item.querySelector("imgSrc").textContent;
      const pricing = item.querySelector("pricing").textContent;
      const category = item.querySelector("category").textContent

      const menuItem = document.createElement("div")
      menuItem.setAttribute("class", "main-menu-item")

      const menuPicture = document.createElement("div")
      menuPicture.setAttribute("class", "main-menu-pic")
      menuPicture.style.backgroundImage = `url(${itemImageSrc})`

      const menuInfo = document.createElement("div")
      menuInfo.setAttribute("class", "main-menu-info")

      const menuName = document.createElement("h2")
      menuName.textContent = itemName

      const menuPrice = document.createElement("h5")
      menuPrice.setAttribute("id","menu-item-price")
      menuPrice.textContent = `₱ ${getPriceValue(pricing,1)}`

      const menuBuyButton = document.createElement("button")
      menuBuyButton.textContent = "Buy"
      menuBuyButton.setAttribute("id","menu-item-button")

      menuBuyButton.addEventListener("click", () => {
        if (authUser === null) {
          openLoginModal();
          return;
        }
        openAddOrderModal(itemImageSrc, pricing, itemName,0);
      });

      menuItem.appendChild(menuPicture)
      menuInfo.appendChild(menuName)
      menuInfo.appendChild(menuPrice)
      menuInfo.appendChild(menuBuyButton)
      menuItem.appendChild(menuInfo)

      if(category === "modifiers"){
        modifiers.appendChild(menuItem)
      }else if(category=== "brSpecial"){

      }
    })
  } catch (error) {
    console.log(error);
  }
}
getAllMainMenu()

const getPriceValue = (value,index)=>{
  const data = JSON.parse(value)
  for(let item of data){
    const temp = item.split(":")
    return temp[index]
  }
}
//Order list

//Frontend-Backend
console.log("checked");