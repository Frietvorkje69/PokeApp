document.getElementById('searchButton').addEventListener('click', async () => {
    const name = document.getElementById('pokemonName').value.toLowerCase();
    try {
        const response = await fetch(`/api/pokemon/${name}`);
        const data = await response.json();

        // 1 in 5 chance for the Pokemon to be shiny
        const isShiny = Math.random() < 0.2;
        const imageUrl = isShiny ? data.sprites.front_shiny : data.sprites.front_default;
        const shinyMessage = isShiny ? '<p class="text-red-500"><strong>Wait.. Is that a shiny?!</p></strong>' : '';

        document.getElementById('pokemonData').innerHTML = `
      <h2 class="text-2xl font-bold mb-4">${data.name.toUpperCase()}'s Stats</h2>
      <img src="${imageUrl}" alt="${data.name}" class="mx-auto mb-4">
      ${shinyMessage}
      <p class="mb-2">Height: ${data.height / 10} m</p>
      <p class="mb-2">Weight: ${data.weight / 10} kg</p>
      <p>Type: ${data.types.map(type => type.type.name).join(', ')}</p>
    `;
    } catch (error) {
        document.getElementById('pokemonData').innerHTML = '<p class="text-red-500">Pokemon not found!</p>';
    }
});
