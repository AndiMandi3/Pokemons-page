import './assets/styles/style.scss'
import type {TPokemonPreview} from './types/pokemonPreview.type'
import {getAllPokemons} from './api/pokemonApi'

const sortResultSelector: HTMLSelectElement | null = document.querySelector("#sort-selector")
const loadMoreButton: HTMLButtonElement | null = document.querySelector('#loadMore')
const showFiltersButton = document.querySelector<HTMLButtonElement>("#showAdvSearch")
let globalLimit: number = 12



async function renderPokemons(recievedPokemons:TPokemonPreview[]) {
    const resultDiv = document.querySelector<HTMLDivElement>('.result__row')

    if(recievedPokemons.length) {

        for (const element of recievedPokemons) {
            
            const item: HTMLDivElement = document.createElement('div')
            item.classList.add('result__item')

            const linkPokemon: HTMLAnchorElement = document.createElement('a')
            linkPokemon.classList.add('result__link')
            linkPokemon.href = "#"

            const imgPokemon: HTMLImageElement = document.createElement('img')
            imgPokemon.classList.add('result__img')
            imgPokemon.src = element.img
            linkPokemon.appendChild(imgPokemon)
            item.appendChild(linkPokemon)

            const pokemonPreview: HTMLDivElement = document.createElement('div')
            pokemonPreview.classList.add('item__pokemon-info')

            const pokemonId: HTMLParagraphElement = document.createElement('p')
            pokemonId.classList.add('pokemon__id')
            pokemonId.textContent = (element.id/1000).toFixed(3).replace('.', '')

            const idPrefix: HTMLSpanElement = document.createElement('span')
            idPrefix.classList.add('number-prefix')
            idPrefix.textContent = "# "
            pokemonId.prepend(idPrefix)
            pokemonPreview.appendChild(pokemonId)

            const pokemonName: HTMLHeadingElement = document.createElement('h5')
            pokemonName.textContent = element.name.charAt(0).toUpperCase() + element.name.slice(1)
            pokemonPreview.appendChild(pokemonName)
            
            const divAbilities: HTMLDivElement = document.createElement('div')
            divAbilities.classList.add('pokemon__abilities')

            if(element.types?.length) {
                element.types.map(async (element: string, index: number) => {
                    const pokemonAbilitie: HTMLSpanElement = document.createElement('span')
                    pokemonAbilitie.classList.add(`pokemon__abilitie--${index}`)
                    pokemonAbilitie.textContent = element.charAt(0).toUpperCase() + element.slice(1)
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

function clearResults() {
    const resultDiv: HTMLDivElement | null = document.querySelector('.result__row')
    if (resultDiv && resultDiv.innerHTML) {
        resultDiv.innerHTML = ''
    }
}

function sortResult(pokemonsArray: TPokemonPreview[]): TPokemonPreview[] {
    if(sortResultSelector) { 

        sortResultSelector.addEventListener('change', async() => {

            if(pokemonsArray.length) {

                clearResults()
                if(sortResultSelector.value === "ascId") {
                    await renderPokemons(pokemonsArray.sort((a, b) => a.id - b.id ))
                }

                else if(sortResultSelector.value === "descId") {
                    await renderPokemons(pokemonsArray.sort((a, b) => b.id - a.id ))
                }

                else if(sortResultSelector.value === "ascName") {
                    await renderPokemons(pokemonsArray.sort((a, b) => a.name.localeCompare(b.name)))
                        
                }

                else if(sortResultSelector.value === "descName") {
                    await renderPokemons(pokemonsArray.sort((a, b) => b.name.localeCompare(a.name)))
                }
            }
        })
    }
    return pokemonsArray
}

if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async() => {
        clearResults()
        globalLimit += 12
        await runResults()
    })
}

if(showFiltersButton) {
    const filterWrap: HTMLDivElement | null = document.querySelector(".filter__wrap")
    showFiltersButton.addEventListener('click', () => {
        if (filterWrap) {

            if(filterWrap.style.height === '0px') {
                showFiltersButton.textContent = "Hide Advanced Search"
                filterWrap!.style.height = 'inherit'

            } else if(filterWrap.style.height === 'inherit') {
                showFiltersButton.textContent = "Show Advanced Search"
                filterWrap.style.height = '0px'
            }
        }
    })
}
async function runResults() {
    const pokemons = await getAllPokemons(globalLimit)
    const sortedPokemons = sortResult(pokemons)
    await renderPokemons(sortedPokemons)
}

await runResults()