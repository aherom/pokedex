const express = require('express');
const { getPokemon } = require('../controllers/pokemonController');

const router = express.Router();

// Route to handle Pokemon search
router.get('/:name', getPokemon);

module.exports = router;
