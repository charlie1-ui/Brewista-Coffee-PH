const express = require("express");
const xml2js = require("xml2js");
const fs = require("fs");
const bodyParser = require("body-parser");
var cors = require("cors");
const xmlparser = require("express-xml-bodyparser");

const app = express();
app.use(cors());
// Use xmlparser as middleware
app.use(xmlparser());
app.use(bodyParser.json());

// utils
const idNumberGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

function formatDateTime() {
  const date = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  const formattedDate = `${month} ${day}, ${year} ${hours}:${minutesStr} ${ampm}`;
  return formattedDate;
}

// Function to read XML file
const readXmlFile = (filePath, callback) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    xml2js.parseString(data, { explicitArray: false }, (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  });
};

// Function to write XML file
const writeXmlFile = (filePath, json, callback) => {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(json);
  fs.writeFile(filePath, xml, "utf8", (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

app.get("/read", (req, res) => {
  const filePath = "orders.xml"; // Path to your XML file
  readXmlFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading XML file: ${err}`);
    }
    res.json(data);
  });
});

// Route to add new order to XML file
app.post("/addOrder", (req, res) => {
  const filePath = "orders.xml"; // Path to your XML file
  const newOrder = req.body;

  readXmlFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading XML file: ${err}`);
    }

    // Ensure that the list and item structure exist
    if (!data.list) {
      data.list = { item: [] };
    } else if (!Array.isArray(data.list.item)) {
      data.list.item = [data.list.item];
    }

    const newOrderData = {
      itemName: newOrder.itemName || "",
      customerName: newOrder.customerName || "",
      customerContact: newOrder.customerContact || "",
      curstomerAddress: newOrder.curstomerAddress || "",
      curstormerID: newOrder.customerID || "",
      orderNumber: idNumberGenerator(),
      orderStatus: "pending",
      quantity: newOrder.quantity || "",
      totalPrice: newOrder.totalPrice || "",
      timestamp: formatDateTime(),
    };

    data.list.item.push(newOrderData);

    writeXmlFile(filePath, data, (err) => {
      if (err) {
        return res.status(500).send(`Error writing XML file: ${err}`);
      }
      res.status(200).json({ message: "ok" });
    });
  });
});

// Route to remove an order by orderNumber
app.delete("/removeOrder", (req, res) => {
  const filePath = "orders.xml"; // Path to your XML file
  const orderNumberToRemove = req.body.orderNumber;
  console.log(orderNumberToRemove);
  readXmlFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading XML file: ${err}`);
    }

    // Ensure that the list and item structure exist
    if (!data.list || !data.list.item) {
      return res.status(404).send("No orders found");
    }

    // If there's only one item, ensure it's treated as an array
    if (!Array.isArray(data.list.item)) {
      data.list.item = [data.list.item];
    }

    // Filter out the item with the matching orderNumber
    data.list.item = data.list.item.filter(
      (item) => item.orderNumber !== orderNumberToRemove
    );

    // Write the updated data back to the XML file
    writeXmlFile(filePath, data, (err) => {
      if (err) {
        return res.status(500).send(`Error writing XML file: ${err}`);
      }
      res.send(
        `Order with orderNumber ${orderNumberToRemove} removed successfully`
      );
    });
  });
});

app.post("/login", (req, res) => {
  const filePath = "users.xml"; // Path to your XML file
  const { username, password } = req.body;

  readXmlFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading XML file: ${err}`);
    }

    const users = data.users.user;
    const user = Array.isArray(users)
      ? users.find((u) => u.username === username)
      : users.username === username
      ? users
      : null;

    if (user && user.password === password) {
      const { password, ...userData } = user;
      res.status(200).json({ message: "ok", data: userData });
    } else {
      res
        .status(200)
        .json({ message: "Incorrect username or password", data: null });
    }
  });
});

app.post("/register", (req, res) => {
  const filePath = "users.xml";
  const newUser = req.body;

  readXmlFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send(`Error reading XML file: ${err}`);
    }

    if (!data.users) {
      data.users = { user: [] };
    } else if (!Array.isArray(data.users.user)) {
      data.users.user = [data.users.user];
    }

    const users = data.users.user;
    const userExists = Array.isArray(users)
      ? users.some((u) => u.username === newUser.username)
      : users.username === newUser.username;

    if (userExists) {
      return res.status(400).send("Username already exists");
    }

    const newOrderData = {
      username: newUser.username || "",
      name: newUser.fullname || "",
      idNumber: idNumberGenerator(),
      password: newUser.password || "",
      contact: newUser.contact || "",
      address: newUser.address || "",
    };

    data.users.user.push(newOrderData);
    const { password, ...userData } = newUser;
    writeXmlFile(filePath, data, (err) => {
      if (err) {
        return res.status(500).send(`Error writing XML file: ${err}`);
      }
      res.status(200).json({ message: "ok", data: userData });
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
