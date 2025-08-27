import type {TPokemonPreview} from "../types/pokemonPreview.type.ts";
import type { TPokemonIdentification } from "../types/pokemonIdentification.type.ts";
import type { TPokemonPageData } from "../types/pokemonPageData.type.ts";

import { convertHeightToInches, convertWeightToLbs } from "../helpers/helpers.pokemonApi.ts";

const URL_API:string = import.meta.env.VITE_URL_API

async function getTypesOfPokemon(name: string): Promise<string[]> {
    try {
        const urlPokemon = await fetch(`${URL_API}/pokemon/${name}`)
        const dataPokemon = await urlPokemon.json()

        return dataPokemon?.types?.map((pokemon: unknown) => {
            if(!pokemon || !(typeof pokemon === 'object') || !("type" in pokemon) || !pokemon.type || !(typeof pokemon.type === "object") || !("name" in pokemon.type)) return []

            return pokemon?.type?.name

        }) || []
    }
    catch(e) {
        return []
    }
    
}

async function getWeaknessesOfPokemon(types: string[]): Promise<string[]> {
    try {
        const allWeaknesses: string[] = []

        for (const type of types) {
            const urlType = await fetch(`${URL_API}/type/${type}`)
            const dataType = await urlType.json()

            for (const weakness of dataType?.damage_relations?.double_damage_from){
                if(!weakness || !(typeof weakness === 'object') ||  !("name" in weakness)) return []

                allWeaknesses.push(weakness?.name)
            }
            
        }
        return allWeaknesses
    }
    catch(e) {
        return ['']
    }
    
}

async function getPokemon(pokemonName: string): Promise<TPokemonPreview | null> {
    try {
        const urlPokemon = await fetch(`${URL_API}/pokemon/${pokemonName}`)
        const dataPokemon = await urlPokemon.json()

        if(!dataPokemon || !(typeof dataPokemon === 'object') || !('id' in dataPokemon) || !(typeof dataPokemon.id === 'number')) return null;
        
        return {
            id: dataPokemon?.id,
            name: dataPokemon?.name,
            types: await getTypesOfPokemon(dataPokemon?.name),
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

async function getDescriptionPokemonForm(id: number = 1): Promise<string> {
    try {
        const json = await fetch (URL_API + `/pokemon-species/${id}`)
        const data = await json.json()

        const allDescriptions = data.flavor_text_entries || null

        let description

        for (const element of allDescriptions) {
            if (!element || !(typeof element === 'object') || !('flavor_text' in element) || !(typeof element.flavor_text === 'string') || !('version' in element) || !(typeof element.version === 'object')) return 'No data'

            if (element.version.name !== 'diamond') {
                continue
            } else {
                description = element.flavor_text
                break
            }
        }
        return description
    }
    catch {
        return 'No data'
    }
    
}

async function getAllGendersPokemon(): Promise<string[]> {
    const urlGenders = await fetch(`${URL_API}/gender/`)
    const genderList = await urlGenders.json()

    const allGenders:string[] = []

    for(const gender of genderList.results) {
        if(!gender || !(typeof gender === 'object') || !('name' in gender) || !(typeof gender.name === 'string')) continue

        allGenders.push(gender.name)

    }

    return allGenders
}

async function getGendersForPokemon(name: string, genders: string[]): Promise<string[]> {
    try {
        const arrayGenders: string[] = []
        genders.forEach(async function(gender)  {
            
            const genderChoiced = await fetch(URL_API + `/gender/${gender}`)
            const genderData = await genderChoiced.json()

            for (const element of genderData.pokemon_species_details) {
                if (!element || !('pokemon_species' in element) || !('name' in element.pokemon_species) || !(typeof element.pokemon_species === 'object') || !(typeof element.pokemon_species.name === 'string')) return []

                if (element.pokemon_species.name === name) {
                    return arrayGenders.push(gender)
                }
            }
        })
        return arrayGenders
        
    } catch (error) {
        return []
    }
    

}

async function getPokemonPageData(id:number = 1): Promise<TPokemonPageData | null>  {
    const json = await fetch(URL_API + `/pokemon/${id}`)
    const pokemonData = await json.json()

    if(!pokemonData || !(typeof pokemonData === 'object') || !('id' in pokemonData) || !(typeof pokemonData.id === 'number')) return null
    
    const mem: TPokemonPageData = {
        name: pokemonData?.name,
        description: await getDescriptionPokemonForm(id),
        img: pokemonData?.sprites?.front_default || '/assets/img/001.png',
        id: pokemonData.id,
        height: convertHeightToInches(pokemonData.height * 10),
        weight: convertWeightToLbs(pokemonData.weight / 10),
        gender: await getGendersForPokemon(pokemonData?.name, await getAllGendersPokemon()),
        category: '',
        types: await getTypesOfPokemon(pokemonData?.name),
        weaknesses: await getWeaknessesOfPokemon(await getTypesOfPokemon(pokemonData?.name)),
        //stats:

    }
    console.log(mem)

    return mem
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