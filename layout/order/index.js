document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "http://localhost:3000/removeOrder/";
  const orderListContainer = document.getElementById("order-list");
  //console.log("Initial orderListContainer:", orderListContainer);

  // Ensure the element is present at the beginning
  if (!orderListContainer) {
    console.error("Order list container not found at start");
    return;
  }

  //Cancel Order Modal
  const closeCancelModal = document.getElementById(
    "cancel-order-confirmation-close"
  );
  const cancelOrderButton = document.getElementById("cancel-order-item");
  const cancelConfirmationBox = document.getElementById(
    "cancel-order-confirmation"
  );

  // Function to show cancel confirmation box
  const showCancel = (cancelConfirmationBox, cancelButton) => {
    cancelConfirmationBox.style.display = "flex";
    cancelButton.style.display = "none";
  };

  // Function to close cancel confirmation box
  const closeCancel = (cancelConfirmationBox, cancelButton) => {
    cancelConfirmationBox.style.display = "none";
    cancelButton.style.display = "flex";
  };

  const handleCancelOrder = async (id) => {
    //console.log(id);
    try {
      fetch(baseUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNumber: id }), // Stringify the body object
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  //Logout
  const logoutButton = document.getElementById("logout-button");
  const handleLogout = () => {
    try {
      localStorage.removeItem("currentUser");
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  logoutButton.addEventListener("click", handleLogout);
  //Logout

  // Get all the orders
  const getAllOrders = async () => {
    //console.log("orderListContainer before fetch:", orderListContainer);

    if (!orderListContainer) {
      console.error("Order list container not found before fetch");
      return;
    }

    try {
      const response = await fetch("../../orders.xml");
      const xmlString = await response.text();
      const xmlFile = new DOMParser().parseFromString(xmlString, "text/xml");
      const orderList = xmlFile.querySelectorAll("item");

      const authUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!authUser) {
        console.error("No authenticated user found");
        return;
      }
      const { idNumber } = authUser;

      // Filter orders based on user's ID number
      orderList.forEach((item) => {
        const customerId = item.querySelector("curstormerID").textContent;
        if (customerId === idNumber) {
          const itemName = item.querySelector("itemName").textContent;
          const timestamp = item.querySelector("timestamp").textContent;
          const itemStatus = item.querySelector("orderStatus").textContent;
          const itemId = item.querySelector("orderNumber").textContent;
          const itemQuantity = item.querySelector("quantity").textContent;
          const itemTotalPrice = item.querySelector("totalPrice").textContent;

          // Create order item elements
          const orderItem = document.createElement("div");
          orderItem.setAttribute("class", "order-item");

          const orderBasicInfo = document.createElement("div");
          orderBasicInfo.setAttribute("class", "order-basic-info");

          const orderName = document.createElement("div");
          orderName.setAttribute("class", "order-name");
          orderName.textContent = `${itemQuantity} - ${itemName}`;

          const orderTotalPrice = document.createElement("div");
          orderTotalPrice.setAttribute("class", "order-total-price");
          orderTotalPrice.textContent = `Total: ₱ ${itemTotalPrice}`;

          const orderDate = document.createElement("div");
          orderDate.setAttribute("class", "order-date");
          orderDate.textContent = timestamp;

          const dividerCon = document.createElement("div");
          dividerCon.setAttribute("class", "divider-con");
          const divider = document.createElement("div");
          divider.setAttribute("class", "divider");
          dividerCon.appendChild(divider);

          const orderFooter = document.createElement("div");
          orderFooter.setAttribute("class", "order-footer");

          const orderStatusCon = document.createElement("div");
          orderStatusCon.setAttribute("id", "order-status-con");

          const orderStatus = document.createElement("div");
          orderStatus.setAttribute("class", "order-status");

          const h3 = document.createElement("h3");
          h3.textContent =
            itemStatus === "pending"
              ? "In queueing"
              : itemStatus === "ok"
              ? "Delivered"
              : "Canceled";

          orderStatus.appendChild(h3);

          const cancelButton = document.createElement("button");
          cancelButton.setAttribute("id", "cancel-order-item");
          cancelButton.disabled = itemStatus === "ok"; // Disable cancel button if status is "ok"
          cancelButton.textContent = "Cancel";

          const cancelConfirmationBox = document.createElement("div");
          cancelConfirmationBox.setAttribute("id", "cancel-order-confirmation");
          cancelConfirmationBox.style.display = "none";

          const cancelOrderPromptTitle = document.createElement("div");
          cancelOrderPromptTitle.setAttribute("id", "cancel-order-prompt-title");

          const h1 = document.createElement("h1");
          h1.textContent = "Cancel order?";

          const cancelOrderButtons = document.createElement("div");
          cancelOrderButtons.setAttribute("id", "cancel-order-buttons");

          const buttonClose = document.createElement("button");
          buttonClose.setAttribute("id", "cancel-order-confirmation-close");
          buttonClose.textContent = "Close";

          const buttonConfirm = document.createElement("button");
          buttonConfirm.setAttribute("id", "cancel-order-confirmation-confirm");
          buttonConfirm.textContent = "Confirm";

          buttonClose.addEventListener("click", () =>
            closeCancel(cancelConfirmationBox, cancelButton)
          );
          buttonConfirm.addEventListener("click", () =>
            handleCancelOrder(itemId)
          );
          cancelButton.addEventListener("click", () =>
            showCancel(cancelConfirmationBox, cancelButton)
          );

          cancelOrderPromptTitle.appendChild(h1);
          cancelOrderButtons.appendChild(buttonClose);
          cancelOrderButtons.appendChild(buttonConfirm);
          cancelConfirmationBox.appendChild(cancelOrderPromptTitle);
          cancelConfirmationBox.appendChild(cancelOrderButtons);

          orderStatusCon.appendChild(orderStatus);
          orderStatusCon.appendChild(cancelButton);

          orderFooter.appendChild(orderStatusCon);
          orderFooter.appendChild(cancelConfirmationBox);

          orderItem.appendChild(orderBasicInfo);
          orderItem.appendChild(dividerCon);
          orderItem.appendChild(orderFooter);

          orderBasicInfo.appendChild(orderName);
          orderBasicInfo.appendChild(orderTotalPrice);
          orderBasicInfo.appendChild(orderDate);

          // Append order item to order list container
          orderListContainer.appendChild(orderItem);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  getAllOrders();
});
