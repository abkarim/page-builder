const express = require('express');
const router = express.Router();
const blocks = require('./../controller/blocks')

router.get('/blocks', blocks.get)

module.exports = router;