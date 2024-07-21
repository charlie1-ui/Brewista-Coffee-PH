const listContainer = document.querySelector(".user-list");
fetch("menu.xml")
  .then((response) => response.text())
  .then((xmlString) => {
    const xmlDocs = new DOMParser().parseFromString(xmlString, "text/xml");
    const drinks = xmlDocs.querySelectorAll("drink[category='espresso']");

    drinks.forEach((drink) => {
      const priceList = drink.querySelector("variant").textContent;
      const title = drink.querySelector("name").textContent;
      const imageSrc = drink.querySelector("imgSrc").textContent;

      try {
        const variants = JSON.parse(priceList);
        variants.forEach((item) => {
          const ul = document.createElement("ul");
          const [size, price] = item.split(":");
          const li = document.createElement("li");
          li.textContent = `${title} (${size}): ${price}`;
          li.classList.add("animate__animated", "animate__fadeIn");

          const img = document.createElement("img");
          img.setAttribute("src", imageSrc);
          img.setAttribute("alt", title);
          img.classList.add("imgContainer"); // Add Animate.css classes

          ul.appendChild(li);
          ul.appendChild(img); // Append the image to the ul
          ul.classList.add("user");
          listContainer.appendChild(ul);

          console.log(`${title} (${size}): ${price}`);
        });
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching or parsing XML:", error);
  });
