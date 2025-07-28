import type { TPokemonPreview } from "../types/pokemonPreview.type"
import { getAllPokemons } from "../api/pokemonApi"
import { sortResult, globalLimit, createHTMLElement } from "../helpers/helpers.mainPage"

async function renderPokemons(recievedPokemons:TPokemonPreview[]) {
    const resultDiv = document.querySelector<HTMLDivElement>('.result__row')

    if(recievedPokemons.length) {

        for (const element of recievedPokemons) {
            
            const item: HTMLElement = createHTMLElement('div', ['result__item'])

            const linkPokemon: HTMLElement = createHTMLElement('a', ['result__link'], {href: "#"})

            const imgPokemon: HTMLElement = createHTMLElement('img', ['result__img'], {src: element.img})
            linkPokemon.appendChild(imgPokemon)
            item.appendChild(linkPokemon)

            const pokemonPreview: HTMLElement = createHTMLElement('div', ['item__pokemon-info'])

            const pokemonId: HTMLElement= createHTMLElement('p', ['pokemon__id'])
            pokemonId.textContent = (element.id/1000).toFixed(3).replace('.', '')

            const idPrefix: HTMLElement = createHTMLElement('span', ['number-prefix'], {textContent: "# "})
            pokemonId.prepend(idPrefix)
            pokemonPreview.appendChild(pokemonId)

            const pokemonName: HTMLElement = createHTMLElement('h5', [], {textContent: element.name.charAt(0).toUpperCase() + element.name.slice(1)})
            pokemonPreview.appendChild(pokemonName)
            
            const divAbilities: HTMLElement = createHTMLElement('div', ['pokemon__abilities'])

            if(element.types?.length) {
                element.types.map(async (element: string, index: number) => {
                    const pokemonAbilitie: HTMLElement = createHTMLElement('span', [`pokemon__abilitie--${index}`], {textContent: element.charAt(0).toUpperCase() + element.slice(1)})
                    divAbilities.appendChild(pokemonAbilitie)
                })
            }
            
            pokemonPreview.appendChild(divAbilities)
            item.appendChild(pokemonPreview)
            resultDiv?.appendChild(item)
        }           
    } else {
        if(resultDiv && resultDiv.innerHTML) {
            resultDiv.style.color = "black"
            resultDiv.innerHTML = "No pokemons found"
        }
    }
}

async function runResults() {
    const pokemons = await getAllPokemons(globalLimit)
    const sortedPokemons = sortResult(pokemons)
    await renderPokemons(sortedPokemons)
}

export {renderPokemons, runResults}