import type {TPokemonPreview} from "../types/pokemonPreview.type.ts";

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

export {URL_API, getPokemon, getAllPokemons};