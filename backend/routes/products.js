const Router = require('express').Router;
const mongodb = require('mongodb');

const db = require('../db');
const decimal = mongodb.Decimal128;
const ObjectId = mongodb.ObjectId;

const router = Router();

// const products = [
//   {
//     _id: 'fasdlk1j',
//     name: 'Stylish Backpack',
//     description:
//       'A stylish backpack for the modern women or men. It easily fits all your stuff.',
//     price: 79.99,
//     image: 'http://localhost:3100/images/product-backpack.jpg'
//   },
//   {
// const products = [
//   {
//     _id: 'fasdlk1j',
//     name: 'Stylish Backpack',
//     description:
//       'A stylish backpack for the modern women or men. It easily fits all your stuff.',
//     price: 79.99,
//     image: 'http://localhost:3100/images/product-backpack.jpg'
//   },
//   {
// const products = [
//   {
//     _id: 'fasdlk1j',
//     name: 'Stylish Backpack',
//     description:
//       'A stylish backpack for the modern women or men. It easily fits all your stuff.',
//     price: 79.99,
//     image: 'http://localhost:3100/images/product-backpack.jpg'
//   },
//   {
//     _id: 'asdgfs1',
//     name: 'Lovely Earrings',
//     description:
//       "How could a man resist these lovely earrings? Right - he couldn't.",
//     price: 129.59,
//     image: 'http://localhost:3100/images/product-earrings.jpg'
//   },
//   {
//     _id: 'askjll13',
//     name: 'Working MacBook',
//     description:
//       'Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!',
//     price: 1799,
//     image: 'http://localhost:3100/images/product-macbook.jpg'
//   },
//   {
//     _id: 'sfhjk1lj21',
//     name: 'Red Purse',
//     description: 'A red purse. What is special about? It is red!',
//     price: 159.89,
//     image: 'http://localhost:3100/images/product-purse.jpg'
//   },
//   {
//     _id: 'lkljlkk11',
//     name: 'A T-Shirt',
//     description:
//       'Never be naked again! This T-Shirt can soon be yours. If you find that buy button.',
//     price: 39.99,
//     image: 'http://localhost:3100/images/product-shirt.jpg'
//   },
//   {
//     _id: 'sajlfjal11',
//     name: 'Cheap Watch',
//     description: 'It actually is not cheap. But a watch!',
//     price: 299.99,
//     image: 'http://localhost:3100/images/product-watch.jpg'
//   }
// ];

// Get list of products products
router.get('/', (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  const queryPage = req.query.page;
  const pageSize = 2;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  let products = [];
  db.getDb()
    .db()
  .collection('products')
    .find()
    // .sort({ price: -1 })
    // .skip((queryPage - 1) * pageSize)
    // .limit(pageSize)
      .forEach(p => {
        // console.log(p);
        p.price = p.price.toString();
        products.push(p)
      })
      .then(result => {
        console.log("result",result);
        res.status(201).json(products);
         
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error Occured' });
      });
  })


// Get single product
router.get('/:id', (req, res, next) => {
  
  db.getDb()
    .db()
  .collection('products')
    .findOne({ _id: new ObjectId(req.params.id) })
    .then(p => {
      p.price = p.price.toString();
      res.status(200).json(p);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error Occured' });
    })
  // res.json(product);
});

// Add new product
// Requires logged in user
router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: decimal.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb().db().collection('products').insertOney(newProduct)
      .then(result => {
        // console.log(result);
        res.status(201).json({ message: 'Product added', productId: result.insertedId });

      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error Occured' });

      });
  })


// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: decimal.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb()
    .db()
    .collection('products')
    .updateOne({ _id: req.params.id }, { $set:  updatedProduct  })
    .then(
      res.status(200).json({ message: 'Product updated', productId: req.params.id })
    )
  .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error Occured' });

      })
});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  db.getDb()
    .db()
    .collection('products')
    // .deleteOne({ _id: new ObjectId(req.params.id) })
    .deleteOne({ _id: req.params.id})
    .then(
      res.status(200).json({ message: 'Product deleted' })
  )
  .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error Occured' });

      })
});

module.exports = router;
