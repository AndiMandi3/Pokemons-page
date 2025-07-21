import './style.scss'
import type {TPokemonType, TPokemonPreview} from './types.ts'

const URL_API:string = "https://pokeapi.co/api/v2/"
const resultDiv: HTMLDivElement | null = document.querySelector('.result__row')

async function getPokemon(pokemonName: string) {
    try {
        const urlPokemon = await fetch(`${URL_API}pokemon/${pokemonName}`)

        // .then((response) => {
        //     if(response.status >= 400 || !response.ok) {
        //         throw new Error ("Not found")
        //     }
        //     console.log(response)
        //     return response
        // })
        // .catch(() => {
        //     return " "
        // })

        const dataPokemon = await urlPokemon.json()

        if(!dataPokemon || !(typeof dataPokemon === 'object') || !('id' in dataPokemon) || !(typeof dataPokemon.id === 'number')) return null

        const metaData: TPokemonPreview = {
            id: dataPokemon.id,
            name: pokemonName,
            types: [],
            img: dataPokemon.sprites.front_default
        }
        
        if (dataPokemon.types || Array.isArray(dataPokemon.types) || dataPokemon.types.length > 0) {
            metaData.types = dataPokemon.types.map((pokemonType: TPokemonType) => {

                if(!pokemonType || !(typeof pokemonType.slot === 'number') || !('slot' in pokemonType) || !(typeof pokemonType.slot === 'number')) return null

                return pokemonType.type.name
            })
        } else {
            return 
        }

        return metaData
    }
    catch(error) {
        return {}
    }
}

async function getAllPokemons(offset: number = 0) {
    try {
        const json = await fetch(URL_API + `pokemon?limit=12&offset=${offset}`)
        const data = await json.json()
        const listPokemons: TPokemonPreview[] = data.results
            .map(async (element: unknown) => {
                if(!element || !(typeof element === 'object') || !('name' in element) || !(typeof element.name === 'string')) return null
                
                return await getPokemon(element.name)
            })
            .filter(Boolean)
        return listPokemons
    }
    catch(e) {
        return []
    }
}


async function renderPokemons() {
    
    let pokemons: any = await getAllPokemons(globalOffset)
    pokemons.map(async (element: TPokemonPreview) => {
        const pokemonData = await element

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
        else {
            return
        }
        
        pokemonPreview.appendChild(divAbilities)
        item.appendChild(pokemonPreview)
        resultDiv?.appendChild(item)
    })
}

const loadMoreButton = document.querySelector('#loadMore')
let globalOffset: number = 0
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async() => {
        globalOffset += 12
        await getAllPokemons(globalOffset)
        await renderPokemons()
    })
}

renderPokemons()