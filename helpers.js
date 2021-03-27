let menu = JSON.parse(JSON.stringify(require("./menu.json")))

// To number the quantity of pizzas in english.
var number_map = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

// Convert a number to the english word of the same number. (Only for numbers less than 20)
toppingCounter = (num) => {
    try {
        // If num is <20 and >0 
        return number_map[num]
    } catch (e) {
        // The client has ordered too much pizza.
        return "Many"
    }
}

// This formats the string representation of the toppings. I/O: ["Ham", "Olives"] -> Ham and Olives
toppingsFormatter = (toppings) => {
    let arr_len = toppings.length

    // Determine the proper format for the language.
    if (arr_len > 1) {

        //Split up the toppings list.
        let last_topping = toppings[arr_len - 1]
        let first_toppings = toppings.slice(0, arr_len - 1)

        // If there are more than three entries in the list, commas and an "and" are required.  If not, then only an "and" is needed.
        if (first_toppings.length > 1) {
            first_toppings = first_toppings.join(", ")
            return first_toppings.slice(0, first_toppings.length) + " and " + last_topping + ": "
        } else {
            return first_toppings[0] + " and " + last_topping + ": "
        }
        //If there are 1 or 0 toppings, return just the topping as a string or nothing respectively. 
    } else if (arr_len == 1) {
        return toppings[0] + " "
    } else {
        return ""
    }
}

/*
Pizza object:
{
    "Size":"Large",
	 "Toppings":["Cheese", "Ham"],
	 "Quantity":1
}
*/

// This crafts the string that is displayed on the frontend.  The input is the pizza object.  
//The menu.json file provides the data needed to preform calculations.
module.exports.order_formatter = (pizza) => {

    // Determine cost of the plain pizza based on the "Size" attribute.
    let size = pizza["Size"]
    let base_cost = menu["size"][size]

    // Determine how many pizzas of this pizza object type have been ordered
    let quantity = pizza["Quantity"]

    //Get the list of toppings from the pizza object.
    let toppings = pizza["Toppings"]
    let number_of_toppings = toppings.length

    // Used to track the cost of each topping in the {toppings} list
    let topping_cost = 0

    // Iterate the toppings list, adding the price of each {topping} to {topping_cost}
    for (let topping of toppings) {
        let topping_type = menu["topping_info"][topping]
        topping_cost += menu["topping_prices"][topping_type][size]
    }

    // Just a grammer corrector.  If there are more than one pizzas, then the response should show pizzas, else, show pizza.
    let extension = ""
    if (quantity > 1) {
        extension = "s"
    }
    // Use the topping formatter function to provide a clean enumeration of toppings in english.
    let toppings_string = toppingsFormatter(toppings)

    // Return a JSON object with the order represented in english and the total cost for the order.
    return { "text": `${quantity} ${size}, ${toppingCounter(number_of_toppings)} Topping Pizza${extension} - ${toppings_string}$${base_cost+topping_cost}`, "price": base_cost + topping_cost }
}