const Pagos = require("../models/pagos");
const Usuario = require("../models/usuario");
const stripe = require("stripe")("sk_test_HaD5Sb4WhDv1P10suN9T7rPU0078Ip2rZV");
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