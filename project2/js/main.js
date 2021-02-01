window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };

let displayTerm = "";
let searchType = "";

function searchButtonClicked() {
    //console.log("searchButtonClicked() called");

    let url = "https://pokeapi.co/api/v2";

    let type = document.querySelector('#type').value;
    searchType = type;
    url += "/" + type;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //String manipulaton to replace spaces with "-"
    let newTerm = "";
    for (let i = 0; i < term.length; i++) {
        if (term[i] == " ") {
            newTerm += "-";
        }
        else {
            newTerm += term[i];
        }
    }
    term = newTerm;

    term = term.trim();
    term = term.toLowerCase()
    term = encodeURIComponent(term);
    if (term.length < 1) return;
    url += "/" + term;


    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "' </br>";

    //console.log(url);

    getData(url);


}

function getData(url) {
    let xhr = new XMLHttpRequest();


    xhr.onload = dataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);

    //console.log("Url used: " +  url);

    xhr.send();
}

function dataLoaded(e) {
    let xhr = e.target;

    //console.log(xhr.responseText);

    //This is an error checker
    if(xhr.responseText == "Not Found"){
        dataError(e);
        return;
    }
    
    let obj = JSON.parse(xhr.responseText);

    //Ok so the links to the wiki are very specific and without this string manipulation they won't work
    let name = "";
    for (let i = 0; i < obj.name.length; i++) {
        if (obj.name[i] == "-") {
            name += "_";
            i++;
            name += obj.name[i].toUpperCase();
        }
        else {
            name += obj.name[i];
        }
    }

    //console.log(name);

    let results = "<p><i>Here are the results for '" + displayTerm + "'</i><p>";

    //Name
    results += `<div class ='result'><p>Name: ${obj.name}`;

    //Pokemon
    if (searchType == "pokemon") {
        url = "https://bulbapedia.bulbagarden.net/wiki/" + name + "_(Pok%C3%A9mon)"

        //Pokedex Number
        results += `<p>Pokedex Number: ${obj.id}</p>`;

        //Types
        results += `<p>Type(s): <ul>`;
        for (let i = 0; i < obj.types.length; i++) {
            results += `<li>${obj.types[i].type.name}</li>`;
        }
        results += `</ul></p>`;

        //Abilities
        results += `<p>Abilities: <ul>`;
        for (let i = 0; i < obj.abilities.length; i++) {
            results += `<li>${obj.abilities[i].ability.name}</li>`;
        }
        results += `</ul></p>`;

        //Moves
        results += `<p>Move(s): <ul>`;
        for (let i = 0; i < obj.moves.length; i++) {
            results += `<li>${obj.moves[i].move.name}</li>`;
        }
        results += `</ul></p>`;
    }

    //Abilities
    else if (searchType == "ability") {

        url = "https://bulbapedia.bulbagarden.net/wiki/" + name + "_(Ability)";


        //Effects - The effects are in different languages so this finds the english one
        for (let i = 0; i < obj.effect_entries.length; i++) {
            if (obj.effect_entries[i].language.name == "en") {
                results += `<p>Effect: ${obj.effect_entries[i].effect}</p>`;
            }
        }

        //Pokemon
        results += `<p>The following pokemon have this ability: <ul>`;
        for (let i = 0; i < obj.pokemon.length; i++) {
            results += `<li>${obj.pokemon[i].pokemon.name}</li>`;
        }
        results += `</ul></p>`;

        //Generation
        results += `<p>Generation Introduced: ${obj.generation.name}</p>`;

    }

    //Moves
    else if (searchType == "move") {

        url = "https://bulbapedia.bulbagarden.net/wiki/" + name + "_(move)";

        //Damage Type
        results += `<p>Damage Type: ${obj.damage_class.name}</p>`;

        //Move Type
        results += `<p>Move Type: ${obj.type.name}</p>`;

        //Accuracy
        if (obj.accuracy == null) {
            results += `<p>Accuracy: Can't miss</p>`;
        } else {
            results += `<p>Accuracy: ${obj.accuracy}</p>`;
        }
        //Power
        if (obj.power != null) {
            results += `<p>Power: ${obj.power}</p>`;
        }
        //pp
        results += `<p>pp: ${obj.pp}</p>`;


        //Effects - The effects are in different languages so this finds the english one
        for (let i = 0; i < obj.effect_entries.length; i++) {

            //If the effect is a percent chance the result has "$effect_chance" instead of giving the actual effect chance.
            if (obj.effect_entries[i].language.name == "en") {
                if (obj.effect_chance == null) {
                    results += `<p>Effect: ${obj.effect_entries[i].effect}</p>`;
                }

                else {
                    let effect = obj.effect_entries[i].effect;
                    let changedEffect = "";
                    for (let j = 0; j < effect.length; j++) {
                        if (effect[j] == "$") {
                            changedEffect += obj.effect_chance;
                            j += 13;
                        }
                        else {
                            changedEffect += effect[j];
                        }
                        //console.log(changedEffect);
                    }
                    results += `<p>Effect: ` + changedEffect + `</p>`;

                }
            }
        }


        //Generation
        results += `<p>Generation Introduced: ${obj.generation.name}</p>`;
    }

    //Types
    if (searchType == "type") {
        url = "https://bulbapedia.bulbagarden.net/wiki/" + name + "_(type)"

        //Super Effective From
        results += `<p>Double Damage From: <ul>`;
        for (let i = 0; i < obj.damage_relations.double_damage_from.length; i++) {
            results += `<li>${obj.damage_relations.double_damage_from[i].name}</li>`;
        }
        results += `</ul></p>`;


        //Super Effective To
        if (obj.damage_relations.double_damage_to.length > 0) {
            results += `<p>Double Damage To: <ul>`;
            for (let i = 0; i < obj.damage_relations.double_damage_to.length; i++) {
                results += `<li>${obj.damage_relations.double_damage_to[i].name}</li>`;
            }
            results += `</ul></p>`;
        }

        //Not Very Effective From
        if (obj.damage_relations.half_damage_from.length > 0) {
            results += `<p>Half Damage From: <ul>`;
            for (let i = 0; i < obj.damage_relations.half_damage_from.length; i++) {
                results += `<li>${obj.damage_relations.half_damage_from[i].name}</li>`;
            }
            results += `</ul></p>`;
        }

        //Not Very Effective To
        results += `<p>Half Damage To: <ul>`;
        for (let i = 0; i < obj.damage_relations.half_damage_to.length; i++) {
            results += `<li>${obj.damage_relations.half_damage_to[i].name}</li>`;
        }
        results += `</ul></p>`;

        //No Damage From
        if (obj.damage_relations.no_damage_from.length > 0) {
            results += `<p>No Damage From: <ul>`;
            for (let i = 0; i < obj.damage_relations.no_damage_from.length; i++) {
                results += `<li>${obj.damage_relations.no_damage_from[i].name}</li>`;
            }
            results += `</ul></p>`;
        }

        //No Damage To
        if (obj.damage_relations.no_damage_to.length > 0) {
            results += `<p>No Damage To: <ul>`;
            for (let i = 0; i < obj.damage_relations.no_damage_to.length; i++) {
                results += `<li>${obj.damage_relations.no_damage_to[i].name}</li>`;
            }
            results += `</ul></p>`;
        }

        //Pokemon
        results += `<p>The following pokemon are this type: <ul>`;
        for (let i = 0; i < obj.pokemon.length; i++) {
            results += `<li>${obj.pokemon[i].pokemon.name}</li>`;
        }
        results += `</ul></p>`;

        //Moves
        results += `<p>Moves of this type: <ul>`;
        for (let i = 0; i < obj.moves.length; i++) {
            results += `<li>${obj.moves[i].name}</li>`;
        }
        results += `</ul></p>`;

        //Generation
        results += `<p>Generation Introduced: ${obj.generation.name}</p>`;

    }

    //Wiki link
    results += `<span><a target='blank' href='${url}'>View on bulbapedia</a></span>`;

    document.querySelector("#content").innerHTML = results;
    document.querySelector("#status").innerHTML = "<b>Success!</b>";

}

function dataError(e) {
    document.querySelector("#content").innerHTML = "<p>An error has occured. Double check your spelling and make sure you have the correct search type on the drop down menu.";
    document.querySelector("#status").innerHTML = "<b>Error!</b>";

}