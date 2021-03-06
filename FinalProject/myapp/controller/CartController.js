var express = require('express');
var productRepo = require('../repo/productRepo'),
    cartRepo = require('../repo/cartRepo');

var router = express.Router();

router.get('/', (req, res) => {
    var arr_p = [];
    for (var i = 0; i < req.session.cart.length; i++) {
        var cartItem = req.session.cart[i];
        console.log(cartItem)
        var p = productRepo.single(cartItem.ProId);
        arr_p.push(p);
    }
    console.log('cart');
    console.log(req.session.cart);
    var items = [];
    var sum = 0;
    Promise.all(arr_p).then(result => {
        for (var i = result.length - 1; i >= 0; i--) {
            var pro = result[i][0];
            
            var item = {
                Product: pro,
                Quantity: req.session.cart[i].Quantity,
                Amount: pro.Price * req.session.cart[i].Quantity,
            };
            sum += parseInt(pro.Price * req.session.cart[i].Quantity);
            console.log('sum: ');
            console.log(sum);
            items.push(item);
        }

        var vm = {
            items: items,
            sum: sum
        };
        res.render('cart/index', vm);
    });
});

router.post('/add', (req, res) => {
    var item = {
        ProId: req.body.proId,
        Quantity: +req.body.quantity,
    };

    cartRepo.add(req.session.cart, item);
    res.redirect(req.headers.referer);
});

router.post('/remove', (req, res) => {
    // console.log('req.session.cart ' + req.session.cart);
    // console.log('req.body.ProId ' + req.body.ProId);
    cartRepo.remove(req.session.cart, req.body.ProId);
    res.redirect(req.headers.referer);
});

module.exports = router;