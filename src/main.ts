import './style.scss'
import type {TPokemonPreview} from './types.ts'

const URL_API:string = "https://pokeapi.co/api/v2/"

async function getPokemon(pokemonName: string): Promise<TPokemonPreview | null> {
    try {
        const urlPokemon = await fetch(`${URL_API}pokemon/${pokemonName}`)
        const dataPokemon = await urlPokemon.json()

        if(!dataPokemon || !(typeof dataPokemon === 'object') || !('id' in dataPokemon) || !(typeof dataPokemon.id === 'number')) return null;
    
        return {
            id: dataPokemon.id,
            name: pokemonName,
            types: dataPokemon?.types?.map((pokemon: unknown) => {
                if(!pokemon || !(typeof pokemon === 'object') || !("type" in pokemon) || !pokemon.type || !(typeof pokemon.type === "object") || !("name" in pokemon.type)) return null

                return pokemon?.type?.name

            }) || [],
            img: dataPokemon?.sprites?.front_default || '/img/001.png'
        };
    } catch(error) {
        return null;
    }
}

async function getAllPokemons(limit: number = 12): Promise<TPokemonPreview[]> {
    try {
        const json = await fetch(URL_API + `pokemon?limit=${limit}&offset=0`);
        const data = await json.json()

        const allPokemons: TPokemonPreview[]= []
        
        for (const element of data.results) {
            if(!element || !(typeof element === 'object') || !('name' in element) || !(typeof element.name === 'string')) continue

            const pokemonData = await getPokemon(element.name)

            if (pokemonData) allPokemons.push(pokemonData)
        }
        return allPokemons
            
    } catch {
        return []
    }
}


async function renderPokemons(recievedPokemons:TPokemonPreview[]) {
    const resultDiv: HTMLDivElement | null = document.querySelector('.result__row')

    if(recievedPokemons.length > 0) {

        for (const element of recievedPokemons) {

            const pokemonData = element
            
            const item: HTMLDivElement = document.createElement('div')
            item.classList.add('result__item')

            const linkPokemon: HTMLAnchorElement = document.createElement('a')
            linkPokemon.classList.add('result__link')
            linkPokemon.href = "#"

            const imgPokemon: HTMLImageElement = document.createElement('img')
            imgPokemon.classList.add('result__img')
            imgPokemon.src = pokemonData.img
            linkPokemon.appendChild(imgPokemon)
            item.appendChild(linkPokemon)

            const pokemonPreview: HTMLDivElement = document.createElement('div')
            pokemonPreview.classList.add('item__pokemon-info')

            const pokemonId: HTMLParagraphElement = document.createElement('p')
            pokemonId.classList.add('pokemon__id')
            pokemonId.textContent = (pokemonData.id/1000).toFixed(3).replace('.', '')

            const idPrefix: HTMLSpanElement = document.createElement('span')
            idPrefix.classList.add('number-prefix')
            idPrefix.textContent = "# "
            pokemonId.prepend(idPrefix)
            pokemonPreview.appendChild(pokemonId)

            const pokemonName: HTMLHeadingElement = document.createElement('h5')
            pokemonName.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
            pokemonPreview.appendChild(pokemonName)
            
            const divAbilities: HTMLDivElement = document.createElement('div')
            divAbilities.classList.add('pokemon__abilities')

            if(pokemonData.types.length > 0) {
                pokemonData.types.map(async (element: string, index: number) => {
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
    }
    else {
        resultDiv!.style.color = "black"
        resultDiv!.innerHTML = "No pokemons found"
    }
}

function clearResults() {
    const resultDiv: HTMLDivElement | null = document.querySelector('.result__row')
    if (!resultDiv || resultDiv.innerHTML === '') {
        return
    }
    resultDiv!.innerHTML = ''
}


const sortResultSelector: HTMLSelectElement | null = document.querySelector("#sort-selector")

function sortResult(pokemonsArray: TPokemonPreview[]): TPokemonPreview[] {
    if(sortResultSelector) { 

        sortResultSelector.addEventListener('change', async() => {

            if(pokemonsArray.length > 0) {

                if(sortResultSelector.value === "ascId") {
                    clearResults()
                    await renderPokemons(pokemonsArray.sort((a, b) => a.id - b.id ))
                }

                else if(sortResultSelector.value === "descId") {
                    clearResults()
                    await renderPokemons(pokemonsArray.sort((a, b) => b.id - a.id ))
                }

                else if(sortResultSelector.value === "ascName") {
                    clearResults()
                    await renderPokemons(pokemonsArray.sort((a, b) => a.name.localeCompare(b.name)))
                        
                }

                else if(sortResultSelector.value === "descName") {
                    clearResults()
                    await renderPokemons(pokemonsArray.sort((a, b) => b.name.localeCompare(a.name)))
                }
            }
        })
    }
    return pokemonsArray
}

const loadMoreButton: HTMLButtonElement | null = document.querySelector('#loadMore')

let globalLimit: number = 12
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async() => {
        globalLimit += 12
        clearResults()

        const pokemons = await getAllPokemons(globalLimit)
        const sortedPokemons = sortResult(pokemons)
        await renderPokemons(sortedPokemons)
    })
}

const pokemons = await getAllPokemons()
let sortedPokemons = sortResult(pokemons)
await renderPokemons(sortedPokemons)