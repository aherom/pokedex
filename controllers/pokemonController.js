const axios = require('axios');

exports.getPokemon = async (req, res) => {
    const pokemonName = req.params.name.toLowerCase();
    const redisClient = req.redisClient;

    try {
        // Check Redis cache
        const cachedData = await redisClient.get(pokemonName);
        if (cachedData) {
            console.log('Cache hit');
            return res.json(JSON.parse(cachedData));
        }

        // Fetch data from PokeAPI
        console.log('Cache miss, fetching from API...');
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = {
            name: response.data.name,
            id: response.data.id,
            height: response.data.height,
            weight: response.data.weight,
            abilities: response.data.abilities.map((a) => a.ability.name),
            types: response.data.types.map((t) => t.type.name),
            sprite: response.data.sprites.front_default,
        };

        // Cache the data with a TTL of 120 seconds
        await redisClient.set(pokemonName, JSON.stringify(data), { EX: 120 });

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Pokemon not found' });
    }
};
