import type { TPokemonPreview } from "../types/pokemonPreview.type"
import {getAllAbilitiesOfPokemon, getAllPokemons, getAllTypesOfPokemon} from "../api/pokemonApi"
import { sortResult, globalLimit, createHTMLElement } from "../helpers/helpers.mainPage"

async function renderTypesOnFilter(recievedTypes: string[]) {
    const containerForFilters  = document.querySelector<HTMLDivElement>('.left-side__pokedex-filter-list')

    if(containerForFilters) {
        for(const filter of recievedTypes) {

            const wrapper: HTMLElement = createHTMLElement('div', ['pokedex-filter-list__filter-row'])
            const typeWrapper: HTMLElement = createHTMLElement('span', ['pill'], {textContent: filter.charAt(0).toUpperCase() + filter.slice(1)})

            const typeToggle: HTMLElement = createHTMLElement('span', ['filter', 'type-filter', 'toggle'], {textContent: 'T'})

            const weakToggle: HTMLElement = createHTMLElement('span', ['filter', 'weakness-filter', 'toggle'], {textContent: 'W'})

            wrapper.appendChild(typeWrapper)
            wrapper.appendChild(typeToggle)
            wrapper.appendChild(weakToggle)

            containerForFilters.appendChild(wrapper)
        }
    }
}


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

            const pokemonName: HTMLElement = createHTMLElement('h5', [], {textContent: element.name.charAt(0).toUpperCase() + element.name.slice(1), 'data-id': "123"})
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
    const filterList = await getAllTypesOfPokemon()
    const abilityList = await getAllAbilitiesOfPokemon()
    const pokemons = await getAllPokemons(globalLimit)
    const sortedPokemons = sortResult(pokemons)

    await renderTypesOnFilter(filterList)
    await renderPokemons(sortedPokemons)
}

export {renderPokemons, runResults}