import type {TPokemonPreview} from "../types/pokemonPreview.type.ts";
import type { TPokemonIdentification } from "../types/pokemonIdentification.type.ts";
import type { TPokemonPageData } from "../types/pokemonPageData.type.ts";

const URL_API:string = import.meta.env.VITE_URL_API

async function getPokemon(pokemonName: string): Promise<TPokemonPreview | null> {
    try {
        const urlPokemon = await fetch(`${URL_API}/pokemon/${pokemonName}`)
        const dataPokemon = await urlPokemon.json()

        if(!dataPokemon || !(typeof dataPokemon === 'object') || !('id' in dataPokemon) || !(typeof dataPokemon.id === 'number')) return null;
        console.log(dataPokemon)
        return {
            id: dataPokemon?.id,
            name: dataPokemon?.name,
            types: dataPokemon?.types?.map((pokemon: unknown) => {
                if(!pokemon || !(typeof pokemon === 'object') || !("type" in pokemon) || !pokemon.type || !(typeof pokemon.type === "object") || !("name" in pokemon.type)) return []

                return pokemon?.type?.name

            }) || [],
            img: dataPokemon?.sprites?.front_default || '/assets/img/001.png'
        };
    } catch(error) {
        return null;
    }
}

async function getAllPokemons(limit: number = 12): Promise<TPokemonPreview[]> {
    try {
        const json = await fetch(URL_API + `/pokemon?limit=${limit}&offset=0`);
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

async function getDescriptionPokemonForm(id: number = 1) {
    const json = await fetch (URL_API + `/pokemon-species/${id}`)
    const data = await json.json()

    console.log(data)
}

async function getPokemonPageData(id:number = 1): Promise<TPokemonPageData | null>  {
    const json = await fetch(URL_API + `/pokemon/${id}`)
    const pokemonData = await json.json()

    console.log(pokemonData)

    if(!pokemonData || !(typeof pokemonData === 'object') || !('id' in pokemonData) || !(typeof pokemonData.id === 'number')) return null
    
    return {
        name: pokemonData?.name,
        description: await getDescriptionPokemonForm(id),


    }
}

async function pokemonsForPagination(): Promise<TPokemonIdentification | null> {
    try {
        const json = await fetch(URL_API + "/pokemon?limit=10000")
        const data = await json.json()

        const pokemonList:TPokemonIdentification[] = data.results

        if(pokemonList.length < 2) {
            return null
        }

        return pokemonList[1]
    }
    catch(error) {
        return null
    }
}

export {URL_API, getPokemon, getAllPokemons, pokemonsForPagination, getPokemonPageData};