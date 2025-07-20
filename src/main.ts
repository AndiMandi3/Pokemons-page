import './style.scss'

const URL_API:string = "https://pokeapi.co/api/v2/"

type TPokemon = {
    name: string,
    url: string
}

type TPokemonType = {
    slot: number,
    type: {
        name: string,
        url: string
    }
}

type TPokemonPreview = {
    id: number,
    name: string,
    types: TPokemonType[],
    img: string,
    url: string
}

async function getAllPokemons(offset: number = 0) {
    console.log(URL_API + `pokemon?limit=12&offset=${offset}`)
    const json = await fetch(URL_API + `pokemon?limit=12&offset=${offset}`)
    const data = await json.json()

    const listPokemons: Array<any> = data.results
        .map(async (element: TPokemon) => {
            const urlPokemon = await fetch(element.url)
            const dataPokemon = await urlPokemon.json()

            const metaData: TPokemonPreview = {
                id: dataPokemon.id,
                name: element.name,
                types: dataPokemon.types.map((pokemonType: TPokemonType) => {
                    return pokemonType.type.name
                }),
                img: dataPokemon.sprites.front_default,
                url: element.url
            }
            return metaData
        })
    return listPokemons
}


async function renderPokemons() {
    const resultDiv: HTMLDivElement | null = document.querySelector('.result__row')
    let pokemons: any = await getAllPokemons(globalOffset)
    console.log(pokemons)
    pokemons.map(async (element: any) => {
        const pokemonData = await element

        const item: HTMLDivElement = document.createElement('div')
        item.classList.add('result__item')

        const linkPokemon: HTMLAnchorElement = document.createElement('a')
        linkPokemon.classList.add('result__link')
        linkPokemon.href = pokemonData.url

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

        pokemonData.types.map(async (element: string) => {
            const pokemonAbilitie: HTMLSpanElement = document.createElement('span')
            pokemonAbilitie.classList.add('pill')
            pokemonAbilitie.textContent = element.charAt(0).toUpperCase() + element.slice(1)
            divAbilities.appendChild(pokemonAbilitie)
        })
        pokemonPreview.appendChild(divAbilities)
        item.appendChild(pokemonPreview)
        resultDiv?.appendChild(item)
    })
}

const loadMoreButton = document.querySelector('#loadMore')
let globalOffset: number = 0
if (loadMoreButton) {
    document.addEventListener('click', async() => {
        globalOffset += 12
        await getAllPokemons(globalOffset)
        await renderPokemons()
    })
}

renderPokemons()