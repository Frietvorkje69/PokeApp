document.getElementById('searchButton').addEventListener('click', async () => {
    const name = document.getElementById('pokemonName').value.toLowerCase();
    try {
        const response = await fetch(`/api/pokemon/${name}`);
        const data = await response.json();

        // 1 in 5 chance for the Pokemon to be shiny
        const isShiny = Math.random() < 0.2;
        const imageUrl = isShiny ? data.sprites.front_shiny : data.sprites.front_default;
        const shinyMessage = isShiny ? '<p class="text-red-500 mb-2"><strong>Wait.. Is that a shiny?!</strong></p>' : '';

        const types = data.types.map(type => {
            return type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
        }).join(', ');

        document.getElementById('pokemonData').innerHTML = `
          <h2 class="text-2xl font-bold mb-4">${data.name.toUpperCase()}'s Stats</h2>
          <img src="${imageUrl}" alt="${data.name}" class="mx-auto mb-4" style="width: 200px; height: 200px;">
          ${shinyMessage}
          <p class="mb-2">Height: ${data.height / 10} m</p>
          <p class="mb-2">Weight: ${data.weight / 10} kg</p>
          <p class="mb-4">Type: ${types}</p>
          <button id="addToTeamButton" class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg ml-4">Add to Team</button>
        `;

        document.getElementById('addToTeamButton').addEventListener('click', () => addToTeam(data, imageUrl, isShiny));
    } catch (error) {
        document.getElementById('pokemonData').innerHTML = '<p class="text-red-500">Pokemon not found!</p>';
    }
});

function addToTeam(pokemon, imageUrl, isShiny) {
    let team = JSON.parse(localStorage.getItem('pokemonTeam')) || [];

    if (team.length >= 6) {
        alert('Your team is full! You can have a maximum of 6 Pokémon.');
        return;
    }

    const newPokemon = {
        name: pokemon.name,
        imageUrl: imageUrl,
        isShiny: isShiny,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types.map(type => type.type.name)
    };

    team.push(newPokemon);
    localStorage.setItem('pokemonTeam', JSON.stringify(team));
    displayTeam();
}

function displayTeam() {
    const team = JSON.parse(localStorage.getItem('pokemonTeam')) || [];
    const teamContainer = document.getElementById('team');
    teamContainer.innerHTML = '';

    team.forEach(pokemon => {
        const types = pokemon.types.map(type => {
            return type.charAt(0).toUpperCase() + type.slice(1);
        }).join(', ');

        const shinyMessage = pokemon.isShiny ? '<p class="text-red-500 mb-2"><strong>Shiny Pokémon!</strong></p>' : '';

        teamContainer.innerHTML += `
          <div class="bg-gray-700 p-4 m-2 rounded-lg text-center">
            <h3 class="text-xl font-bold">${pokemon.name.toUpperCase()}</h3>
            <img src="${pokemon.imageUrl}" alt="${pokemon.name}" class="mx-auto mb-2" style="width: 100px; height: 100px;">
            ${shinyMessage}
            <p class="mb-2">Height: ${pokemon.height / 10} m</p>
            <p class="mb-2">Weight: ${pokemon.weight / 10} kg</p>
            <p>Type: ${types}</p>
          </div>
        `;
    });
}

document.getElementById('clearTeamButton').addEventListener('click', clearTeam);

function clearTeam() {
    localStorage.removeItem('pokemonTeam');
    displayTeam();
    alert('Your team has been cleared!');
}

// Initial display of team on page load
document.addEventListener('DOMContentLoaded', displayTeam);
