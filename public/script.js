document.getElementById('searchBtn').addEventListener('click', async () => {
    const pokemonName = document.getElementById('pokemonName').value.trim();

    if (!pokemonName) {
        alert('Please enter a Pokemon name!');
        return;
    }

    try {
        const response = await fetch(`/pokemon/${pokemonName}`);
        if (response.status === 404) {
            document.getElementById('result').innerHTML = `<p class="text-danger">Pokemon not found!</p>`;
        } else {
            const data = await response.json();
            document.getElementById('result').innerHTML = `
                <h3>${data.name} (#${data.id})</h3>
                <img src="${data.sprite}" alt="${data.name}">
                <p><strong>Height:</strong> ${data.height}</p>
                <p><strong>Weight:</strong> ${data.weight}</p>
                <p><strong>Abilities:</strong> ${data.abilities.join(', ')}</p>
                <p><strong>Types:</strong> ${data.types.join(', ')}</p>
            `;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML = `<p class="text-danger">Error fetching data.</p>`;
    }
});
