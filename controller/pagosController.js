const Pagos = require("../models/pagos");
const Usuario = require("../models/usuario");
require('dotenv').config({path: 'variables.env'});
const stripe = require("stripe")(process.env.API_PUBLIC_KEY_STRIPE);
const {v4 : uuidv4} = require("uuid");
exports.insertarPago = async (req, res) => {
    console.log(req.body);
    const { product, token } = req.body;
    const potencykey = uuidv4();
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.nowPrice * 100,
            currency: "usd",
            customer: customer.id,
            recipt_email: token.email,
            shipping: {
                name: token.card.name
            }
        }, {potencykey});
    }).then( res => {
        console.log('entro then', res)
        return res.status(200).json(res);
    } )
    .catch(err => console.log("error", err));
}