// External libraries
let express = require("express")
let bodyparser = require("body-parser");
const cors = require("cors");

//Since there is a small dataset, it is suitible to use a json file to store the menu.
let helper = require("./helpers")

// Express initializations.
let app = express()
let port = 3000

//Middleware.
app.use(bodyparser.json())
app.use(cors());

// The route the frontend can use to post its order to the backend.
app.post("/order", (req, res) => {

    // Get the order attribute of the request body
    let order = req.body.order;

    //An object used to store data useful in creating the receipt.
    let receipt = { "pizzas": [] }

    // The total cost of the order before taxes.
    total = 0

    // Iterate over the order and pass each iterated object into a helper function. (see helper.js)
    for (let i = 0; i < order.length; i++) {
        let pizza = order[i]
        let order_response = helper.order_formatter(pizza)
        receipt["pizzas"].push(order_response["text"])
        total += order_response["price"]
    }
    // Process the data gathered from the processing of each entry in the order object.
    receipt["price"] = total
        //Calculate the total after tax.
    receipt["after_tax"] = Math.round(total * 105) / 100
    res.json(receipt)

})

//Listen on port, error handleing
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
}).on('error', (e) => {
    console.log("Error: Port 3000 is in use.")
})