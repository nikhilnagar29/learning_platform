const express = require('express');
const router = express.Router();

const { hostController, joinController , messageController} = require('../controllers/mainController');

router.post('/host', hostController);
router.post('/join', joinController);
router.get('/message' , messageController);

module.exports = router;