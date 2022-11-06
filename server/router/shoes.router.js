const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {addShoes} = require('../controllers/shoes.controller');
const router = express.Router();

router.route('/addShoes').post(addShoes);


module.exports = router;