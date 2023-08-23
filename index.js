//this file is the starting point

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser')
var mysql = require('mysql');
var session = require('express-session')                                              //we want to be able to use session in our application
                         //a secret helps info to work properly

/*?mysql.createConnection({                    //this is used to establish a connection with mysql
     host: "localhost",
     user: "root",
     password: "",
     database: "node_comm_project"
})   */                                

                                


var app = express()  //this app helps to use express, it helps deliver page to the user



app.use(express.static('public'));                 //this tells the page to use the files on the public folder, so it displays those pages to the user
app.set('view engine', 'ejs')                         //this tells express to set view engine as an ejs file



 app.listen(8080)         //this is the port used to run our application
 app.use(bodyParser.urlencoded({extended: true}))          //this is what we need in order to be able to use body-parser
 app.use(session({secret:"secret"}))                           //  //a secret helps decision to work properly


function isProductInCart(cart, id){        //to check if a product is in the cart

    for(let i = 0; i < cart.length; i++){
        if(cart[i].id == id){
            returntrue;
        }
    }

    return false;


}



function calculateTotal(cart, req){     //req helps to get full info about the ppage
total = 0;
for(let i =0; i < cart.length; i++){

    //if a discounted price is being offered
    if(cart[i].sale_price){
        total = total + (cart[i].sale_price * cart[i] . quantity)
    }else{
        total = total + (cart[i].price * cart[i].quantity)
    }
}
req.session.total = total;

return total

}




app.get('/', function(req, res){                //this helps create a server

    
var con = mysql.createConnection({      
  host: "localhost",
  user: "root",
  password: "",
  database: "node_comm_project",
}); 


       con.query("SELECT * FROM products", (err,result) => {
             res.render("pages/index", {result: result});


       })

   

})
    //res.render("pages/index");       //this is the page that users sees
    //res.send('"Hello"');                //response to the user

    app.post('/add_to_cart', function(req, res){    //this is how the data is gotten to be in the form

     var id = req.body.id;
     var name = req.body.name;
     var price = req.body.price;
     var sale_price = req.body.sale_price;
     var quantity = req.body.quantity;
     var image  = req.body.image;
     var product = {id: id, name: name, price: price, sale_price: sale_price, quantity: quantity, image: image};

      


     if(req.session.cart){
        var cart = req.session.cart;
        
        
        if(!isProductInCart(cart, id)){
            cart.push(product);
        }else{



            req.session.cart = [product];
            var cart = req.session.cart;
        }


     }



     //calculate total
     calculateTotal(cart, req);

     //return to cart page

     res.redirect('/cart');

    })


    app.get('/cart', function(req, res){


        var cart = req.session.cart;                   //to get the cart and total and then display
        var total = req.session.total;

        res.render('pages/cart', {cart:cart, total:total})                                                            //they are both passed to the cart


    })
             


    app.post('/remove_product', function(req, res){

        var id = req.body.id;
        var cart = req.session.cart;


        for(let i = 0; i < cart.length; i++){                   
            if(cart[i].id == id){                          //if a product matches a particular id, it is removed
                cart.splice(cart.indexOf(i), 1)             //splice helps to remove the particular product {1} that has the particular id
            }
        }

        //when a product is removed, the total is to be re-calculated
        calculateTotal(cart, req);
        res.redirect('/cart');
    });


    app.post('/edit_product_quantity', function(req,res){


        //get values from the input
        var id = req.body.id;
        var quantity = req.body.quantity;
        var increase_btn = req.body.increase_product_quantity;
        var decrease_btn = req.body.decrease_product_quantity;

        var cart = req.session.cart;
        

        //to check for the button that a user clicks on
        if(increase_btn){
            for(let i = 0; i < cart.length; i++){

                if(cart[i].id == id){

                    if(cart[i].quantity > 0)       //it checks if the qty is more than 0, this is only when it can work
                    cart[i].quantity = parseInt(cart[i].quantity) + 1
                }
            }
        }



           if (decrease_btn) {
             for (let i = 0; i < cart.length; i++) {
               if (cart[i].id == id) {
                 if (cart[i].quantity > 1)
                   //it checks if the qty is more than 0, this is only when it can work
                   cart[i].quantity = parseInt(cart[i].quantity) - 1;
               }
             }
           }

        calculateTotal(cart, req);       //we need to recalculate the total
        res.redirect('/cart')


    });


    //for the checkout form
    app.get('/checkout', function(req,res){     //this takes the user to the checkout page
 
        var total = req.session.total
        res.render('pages/checkout', {total:total})
    })              


    app.post('/place_holder', function(req, res){                //this handles submission of the form

        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var city = req.body.city;
        var address = req.body.address
        var cost = req.session.total;           //the cost is stored in the session
        var status = "not paid";
        var date = new Date();
        var products_ids = "";
  




        var con = mysql.createConnection({          //then the connection to sql is established
          host: "localhost",
          user: "root",
          password: "",
          database: "node_comm_project",
        });


        var cart = req.session.cart;
        for(let i = 0; i <cart.length; i++){
            products_ids = products_ids + "," +cart[i].id
        }


        con.connect((err) =>{               //it checks whether or not there's an error if not these() are inserted
            if(err){
                console.log(err);
            }else{
                var query = "INSERT INTO orders(cost, name,email,status,city,address,phone,date,products_ids) VALUES ?";
                var values = [
                  [
                    cost,
                    name,
                    email,
                    status,
                    city,
                    address,
                    phone,
                    date,
                    products_ids,
                  ],
                ];


                con.query(query,[values], (err, result) => {

                    res.redirect('/payment');
                })
            }
        })
    }) 
    
    
    app.get('/payment', function(req,res){

        
        res.render('/pages/payment')


    })
