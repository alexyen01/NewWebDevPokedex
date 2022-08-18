
var submitButton = document.getElementById("submit");
var previousButton = document.getElementById("previous");
var nextButton = document.getElementById("next");
var currentPokemonNumber = 1;

const pokemonSprite = document.createElement('img');

var textBox = document.getElementById("pokemon");

const pokemonNameElement = document.getElementById("pokemonName");

var entryTitle = document.getElementById("entryTitle");
var evoTitle = document.getElementById("evoFamilyTitle");

submitButton.addEventListener("click", function() {
  //get the pokemon name
  let pokemon = textBox.value.toLowerCase();
  getPokemon(pokemon);
})

previousButton.addEventListener("click", function() {
  //get the pokemon name
  let pokemon = "";
  if (currentPokemonNumber > 1) {
    
    pokemon = --currentPokemonNumber;
  }
  getPokemon(pokemon);
})

nextButton.addEventListener("click", function() {
  //get the pokemon name
  let pokemon = "";
  if (currentPokemonNumber < 905) {

    pokemon = ++currentPokemonNumber;
  }
  getPokemon(pokemon);
})

function httpGet(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

// Execute a function when the user presses a key on the keyboard
textBox.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submit").click();
  }
}); 

const firstEvoSprite = document.createElement('img');
const secondEvoSprite = document.createElement('img');
const thirdEvoSprite = document.createElement('img');

var firstEvoName = document.getElementById("firstEvoName");
var secondEvoName = document.getElementById("secondEvoName");
var thirdEvoName = document.getElementById("thirdEvoName");

var firstEvoNumber = "";
var secondEvoNumber = "";
var thirdEvoNumber = "";
function getPokemon(pokemon) {
  if (pokemon == "") {
    pokemonNameElement.innerHTML = "Not a valid pokemon";
    pokemonSprite.src = "";  
    return;
  }
  textBox.value = "";
  let url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
  //get the json of the pokemon
  let pokeJson = httpGet(url);
  console.log(pokeJson);
  if (pokeJson == "Not Found") {
      pokemonNameElement.innerHTML = "Not a valid pokemon";
      entryTitle.innerHTML = "";
      pokemonSprite.src = "";  

      firstEvoName.innerHTML = "";
      firstEvoSprite.src = "";
      firstEvoNumber = "";

      secondEvoName.innerHTML = "";
      secondEvoSprite.src = "";
      secondEvoNumber = "";
  
      thirdEvoName.innerHTML = "";
      thirdEvoSprite.src = "";
      thirdEvoNumber = "";
      
  } else {
    entryTitle.innerHTML = "Requested Pokemon:"
    //parse the json
    let parseJson = JSON.parse(pokeJson);
    //get data
    currentPokemonNumber = parseJson["id"];
    let sprites = parseJson["sprites"];
    let spriteUrl = sprites["front_default"];
    //store the sprite from the json
    const displaySprite = document.getElementById("pokemonSprite");
    pokemonSprite.src = spriteUrl;
    displaySprite.appendChild(pokemonSprite);
    //display the name
    let pokemonName = parseJson["forms"][0]["name"];
    pokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    pokemonNameElement.innerHTML = "No. " + parseJson["id"] + " - " + pokemonName;  
    getEvolution(parseJson);
  }
}

function getEvolution(pokeJson) {
  evoTitle.innerHTML = "Evolution Family Tree:";
  //get species to get to evolution chain
  let speciesUrl = pokeJson["species"]["url"];
  let speciesJson = httpGet(speciesUrl);
  speciesJson = JSON.parse(speciesJson);
  if (speciesJson["evolution_chain"] == null) {
    firstEvoName.innerHTML = "";
    firstEvoSprite.src = "";
    firstEvoNumber = "";

    secondEvoName.innerHTML = "";
    secondEvoSprite.src = "";
    secondEvoNumber = "";

    thirdEvoName.innerHTML = "";
    thirdEvoSprite.src = "";
    thirdEvoNumber = "";
    return;
  }
  let evolutionUrl = speciesJson["evolution_chain"]["url"];
  evolutionJson = httpGet(evolutionUrl);
  evolutionJson = JSON.parse(evolutionJson);

  //get the first evolution of the pokemon
  let firstEvolutionSpeciesUrl = evolutionJson["chain"]["species"]["url"];
  let firstEvolutionSpeciesJson = httpGet(firstEvolutionSpeciesUrl);
  firstEvolutionSpeciesJson = JSON.parse(firstEvolutionSpeciesJson);
  let firstEvolutionUrl = firstEvolutionSpeciesJson["varieties"][0]["pokemon"]["url"];
  let firstEvolutionJson = httpGet(firstEvolutionUrl);
  
  firstEvolutionJson = JSON.parse(firstEvolutionJson);
  firstEvoNumber = firstEvolutionJson["id"];
  const firstDisplaySprite = document.getElementById("firstEvoSprite");
  let firstSpriteUrl = firstEvolutionJson["sprites"]["front_default"];
  firstEvoSprite.src = firstSpriteUrl;
  firstDisplaySprite.appendChild(firstEvoSprite);

  let tempName = firstEvolutionJson["forms"][0]["name"];
  tempName = tempName.charAt(0).toUpperCase() + tempName.slice(1);
  firstEvoName.innerHTML = "No. " + firstEvoNumber + " - " + tempName;

  if (evolutionJson["chain"]["evolves_to"].length != 0) {
    let secondEvoultionSpeciesUrl = evolutionJson["chain"]["evolves_to"][0]["species"]["url"];
    let secondEvolutionSpeciesJson = httpGet(secondEvoultionSpeciesUrl);
    secondEvolutionSpeciesJson = JSON.parse(secondEvolutionSpeciesJson);
    secondEvolutionUrl = secondEvolutionSpeciesJson["varieties"][0]["pokemon"]["url"];
    secondEvolutionJson = httpGet(secondEvolutionUrl);

    secondEvolutionJson = JSON.parse(secondEvolutionJson);
    secondEvoNumber = secondEvolutionJson["id"];
    const secondDisplaySprite = document.getElementById("secondEvoSprite");
    let secondSpriteUrl = secondEvolutionJson["sprites"]["front_default"];
    secondEvoSprite.src = secondSpriteUrl;
    secondDisplaySprite.appendChild(secondEvoSprite);

    tempName = secondEvolutionJson["forms"][0]["name"];
    tempName = tempName.charAt(0).toUpperCase() + tempName.slice(1);
    secondEvoName.innerHTML = "No. " + secondEvoNumber + " - " + tempName;


    if (evolutionJson["chain"]["evolves_to"][0]["evolves_to"].length != 0) {
      let thridEvolutionSpeciesUrl = evolutionJson["chain"]["evolves_to"][0]["evolves_to"][0]["species"]["url"];
      let thirdEvolutionSpeciesJson = httpGet(thridEvolutionSpeciesUrl);
      thirdEvolutionSpeciesJson = JSON.parse(thirdEvolutionSpeciesJson);
      let thirdEvoultionUrl = thirdEvolutionSpeciesJson["varieties"][0]["pokemon"]["url"];
      let thirdEvolutionJson = httpGet(thirdEvoultionUrl);

      thirdEvolutionJson = JSON.parse(thirdEvolutionJson);
      thirdEvoNumber = thirdEvolutionJson["id"];
      const thirdDisplaySprite = document.getElementById("thirdEvoSprite");
      let thirdSpriteUrl = thirdEvolutionJson["sprites"]["front_default"];
      thirdEvoSprite.src = thirdSpriteUrl;
      thirdDisplaySprite.appendChild(thirdEvoSprite);

      tempName = thirdEvolutionJson["forms"][0]["name"];
      tempName = tempName.charAt(0).toUpperCase() + tempName.slice(1);
      thirdEvoName.innerHTML = "No. " + thirdEvoNumber + " - " + tempName;

    } else {
      thirdEvoName.innerHTML = "";
      thirdEvoSprite.src = "";
      thirdEvoNumber = "";

    }
  } else {
    secondEvoName.innerHTML = "";
    secondEvoSprite.src = "";
    secondEvoNumber = "";

    thirdEvoName.innerHTML = "";
    thirdEvoSprite.src = "";
    thirdEvoNumber = "";
  }
  
}

