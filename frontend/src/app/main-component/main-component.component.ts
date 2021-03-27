import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.css']
})
export class MainComponentComponent implements OnInit {

  // Initializations.
  est_cost=0;
  est_total_cost=0;
  size:String = "Small"
  response = false;
  quantity=1;
  cheese:Boolean;
  pepperoni:Boolean;
  ham:Boolean;
  pineapple:Boolean;
  sausage:Boolean;
  feta:Boolean;
  tomatoes:Boolean;
  olives:Boolean;
  price=0;
  after_tax=0;
  order = []
  toppings = []
  
  // Compute a rough estimate for the customer.
  estimate():void{
    if(this.size=="Small"){
      this.est_cost = 12 + (0.75*this.toppings.length)
      }else if(this.size=="Medium"){
        this.est_cost = 14 + (0.75*this.toppings.length)
      }else if(this.size=="Large"){
        this.est_cost = 16 + (0.75*this.toppings.length)
        }
  }
  constructor(private http: HttpClient    ) { 
    this.estimate()
  }


  ngOnInit(): void {
  }

  // Clear all information derived from the most recent post to "/order".
  clearOrder(event:any){
    this.est_total_cost=0
    this.response=false
    this.order = []
  }

  //Read the value of the selector.
  changeSelect(event:any){
    //Read value
    this.size = event.target.value;
    
    //Estimator compute.
    this.estimate()

  }
  addToOrder():void{
    
    // Determine which checkboxes are selected
    this.toppings = []
    if(this.cheese){
      this.toppings.push("Cheese")
    }
    if(this.pepperoni){
      this.toppings.push("Pepperoni")
    }
    if(this.ham){
      this.toppings.push("Ham")
    }
    if(this.pineapple){
      this.toppings.push("Pineapple")
    }
    if(this.sausage){
      this.toppings.push("Sausage")
    }
    if(this.feta){
      this.toppings.push("Feta Cheese")
    }
    if(this.tomatoes){
      this.toppings.push("Tomatoes")
    }
    if(this.olives){
      this.toppings.push("Olives")
    }
    // Push a pizza to the total
    this.order.push({"Size":this.size,"Toppings":this.toppings, "Quantity":this.quantity})
    
    // Compute estimates
    this.estimate()
    this.est_total_cost += this.est_cost
  }
  purchase():void{
    // Send out the post request.
    this.http.post("http://localhost:3000/order",{"order":this.order}).subscribe(res=>{
      // Set some display variables
      this.response = res["pizzas"]
      this.price = res["price"]
      this.after_tax = res["after_tax"]
    })
  }

}
