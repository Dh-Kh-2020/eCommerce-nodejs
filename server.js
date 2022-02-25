import express from 'express';
const server = express();

import fetch from 'node-fetch';
// import cookieSession from 'cookie-session';

// server.set('trust proxy', 1)
// server.use(
//     cookieSession({
//         name: "__session",
//         keys: ["key1"],
//         maxAge: 24 * 60 * 60 * 100,
//         secure: true,
//         httpOnly: true,
//         sameSite: 'none'
//     })
// );

server.set('view engine', 'ejs');
server.use(express.static('public'));
server.set('views', 'views');

const Port = process.env.PORT || 8080;
server.listen(Port, console.log(`Server Started At Port: ${Port}`));


server.get(['/', 'index'], async (req, response) => {
    let categ = await fetch('https://dummyjson.com/products/categories')
        .then(res1 => res1.json())
        .then(res1 => res1.slice(0, 12)); //
    // console.log(categ);
    fetch('https://dummyjson.com/products?limit=21&select=title,price,rating,description,thumbnail')
        .then(res => res.json())
        .then(res => response.render('index', { products: res.products, categories: categ}))

    
});

server.get('/search', (req, response) => {
    if(req.query.hasOwnProperty('q')){
        fetch('https://dummyjson.com/products/search?q='+req.query.q)
            .then(res => res.json())
            .then(res => response.render('index', { products: res.products }));
    }
});

// server.get('/products', (req, res) => {
//     res.render('products');
// });

server.get("/products/:prod_id([1-9]{1,3})?", async (req, response) => {
    if(req.params.prod_id) {
        await fetch('https://dummyjson.com/products/'+req.params.prod_id)
        .then(res => res.json())
        .then(res => response.render('single_product', { product: res}));
    }
    else{
        let categ = await fetch('https://dummyjson.com/products/categories')
            .then(res1 => res1.json())
            .then(res1 => res1.slice(0, 3)); 
        fetch('https://dummyjson.com/products/')
            .then(res => res.json())
            .then(res => response.render('index', { products: res.products, categories: categ}));
    }
});

server.get('/products/:category', async (req, response) => {
    let cat= await fetch('https://dummyjson.com/products/categories')
        .then(res1 => res1.json())
        .then(res1 => res1.slice(0, 12));
    fetch('https://dummyjson.com/products/category/'+req.params.category)
        .then(res2 => res2.json())
        .then(res2 => response.render('products', { products: res2.products, categories: cat, currentCate: req.params.category }));     
});

server.get('/about', (req, res) => {
    res.render('about');
});

server.get('/contact', (req, res) => {
    res.render('contact');
});

server.get('*', (req, res) => {
    res.send(404);
});

// server.get('/single_product', (req, res) => {
//     res.render('single_product');
// });

// server.get("/products/:prod_id?", (req, response) => {
//     if (req.params.prod_id) {
//         fetch('https://dummyjson.com/products?limit=10')
//             .then(res1 => res1.json())
//             .then(r1 => {
//                 fetch('https://dummyjson.com/products/categories')
//                     .then(r2 => r2.json())
//                     .then(r2 => {

//                         fetch('https://dummyjson.com/products/' + req.params.prod_id)
//                             .then(res2 => res2.json())
//                             .then(r3 => response.render('single_product', { product: r3, products: r1.products, categories: r2 }));
//                     })
//             });
//     }
// });