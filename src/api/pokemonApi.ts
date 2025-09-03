import type {TPokemonPreview} from "../types/pokemonPreview.type.ts";
import type { TPokemonIdentification } from "../types/pokemonIdentification.type.ts";
import type { TPokemonPageData } from "../types/pokemonPageData.type.ts";

import { convertHeightToInches, convertWeightToLbs } from "../helpers/helpers.pokemonApi.ts";
import type { TPokemonAbility } from "../types/pokemonAbility.type.ts";

import { isPokemonPreview } from "../types/guards/isPokemon.guard.ts";

const URL_API:string = import.meta.env.VITE_URL_API

async function getPokemon(pokemonName: string): Promise<TPokemonPreview | null> {
    try {
        const dataPokemon = await getPokemonData(pokemonName);
        
        return {
            id: dataPokemon?.id,
            name: dataPokemon?.name,
            types: await getTypesOfPokemon(dataPokemon?.name),
            img: dataPokemon?.sprites?.front_default || '/assets/img/001.png'
        };
    } catch {
        return null;
    }
}

async function getPokemonData(pokemonName: string) {
    try {
        const urlPokemon = await fetch(`${URL_API}/pokemon/${pokemonName}`)
        const dataPokemon = await urlPokemon.json()

        if(!dataPokemon && isPokemonPreview(dataPokemon)) return null;

        return dataPokemon
    } catch {
        return null
    }
}

async function getPokemonSpeciesData(pokemonName: string) {
    const json = await fetch (URL_API + `/pokemon-species/${pokemonName}`)
    const data = await json.json()

    return data
}

await getPokemonSpeciesData('bulbasaur')

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
        const json = await getPokemonSpeciesData(id.toString());
        const data = await json.json()

        const allDescriptions = data.flavor_text_entries || null

        let description

        for (const element of allDescriptions) {
            if (!element || !(typeof element === 'object') || !('flavor_text' in element) || !(typeof element.flavor_text === 'string') || !('version' in element) || !(typeof element.version === 'object')) return 'No data'

            if (element.version.name === 'diamond') {
                description = element.flavor_text
                break
            }
        }
        return description
    } catch {
        return 'No data'
    }
    
}

async function getCategoryPokemon(pokemonName: string): Promise<string[]> {
    try {
        const allCategories: string[] = []
        const urlSpecie = await getPokemonSpeciesData(pokemonName)
        const specieSpecification = await urlSpecie.json()

        const genera = specieSpecification.genera

        const categoriesFiltered = genera.filter((element:unknown) => {
            if( !element || 
                !(typeof element === 'object') || 
                !('language' in element) || 
                !(typeof element.language === 'object') || 
                !element.language || !('name' in element.language) || 
                !(typeof element.language.name === 'string')
            ) return []

            return element.language.name === 'en'
        })

        categoriesFiltered.forEach((element:unknown) => {
            if( !element || 
                !(typeof element === 'object') || 
                !('genus' in element) ||
                !(typeof element.genus === 'string') ||
                !element.genus
            ) return {}
            allCategories.push(element.genus)
        })

        return allCategories

    } catch {
        return []
    }
}

async function getAllGendersPokemon(): Promise<string[]> {
    try {
        const urlGenders = await fetch(`${URL_API}/gender/`)
        const genderList = await urlGenders.json()

        const allGenders:string[] = []

        for(const gender of genderList.results) {
            if(!gender || !(typeof gender === 'object') || !('name' in gender) || !(typeof gender.name === 'string')) continue

            allGenders.push(gender.name)

        }

        return allGenders
    } catch {
        return []
    }
    
}

async function getGendersForPokemon(name: string, genders: string[]): Promise<string[]> {
    try {
        const arrayGenders: string[] = []
        for (const gender of genders) {

            const genderChoiced = await fetch(URL_API + `/gender/${gender}`)
            const genderData = await genderChoiced.json()

            for (const element of genderData.pokemon_species_details) {
                if (!element || !('pokemon_species' in element) || !('name' in element.pokemon_species) || !(typeof element.pokemon_species === 'object') || !(typeof element.pokemon_species.name === 'string')) [];

                if (element.pokemon_species.name === name) {
                    arrayGenders.push(gender);
                }
            }
        }
        return arrayGenders
        
    } catch {
        return []
    }
}

async function getTypesOfPokemon(name: string): Promise<string[]> {
    try {
        const urlPokemon = await getPokemonData(name)
        const dataPokemon = await urlPokemon.json()

        return dataPokemon?.types?.map((pokemon: unknown) => {
            if(!pokemon || !(typeof pokemon === 'object') || !("type" in pokemon) || !pokemon.type || !(typeof pokemon.type === "object") || !("name" in pokemon.type)) return []

            return pokemon?.type?.name

        }) || []
    } catch {
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
    } catch {
        return []
    }
    
}



async function getDescriptionPokemonAbilitie(url:string): Promise<string> {
    try {
        const jsonDescription = await fetch(url)
        const abilityDescriptions = await jsonDescription.json()

        console.log(abilityDescriptions)

        const arrayDescriptions = abilityDescriptions.flavor_text_entries || null

        let descriptionAbility

        for (const description of arrayDescriptions) {
            if( !description || 
                !('flavor_text' in description) || 
                !(typeof description.flavor_text === 'string') || 
                !('version_group' in description) || 
                !(typeof description.version_group === 'object') || 
                !description.version_group || 
                !('name' in description.version_group) || 
                !(typeof description.version_group.name === 'string') || 
                !('language' in description) || 
                !(typeof description.language === 'object') || 
                !description.language || 
                !('name' in description.language) || 
                !(typeof description.language.name === 'string')
            ) return 'No data'

            
            if(description.version_group.name === 'scarlet-violet' || description.language.name === 'en') {
                descriptionAbility = description?.flavor_text
                break
            }
        }
        return await descriptionAbility || 'No data'
    } catch {
        return 'No data'
    }
    
}

async function getAbilitiePokemon(pokemonAbilities: unknown[]): Promise<TPokemonAbility[]> {
    try {

        const resultAbilities: TPokemonAbility[] = []
        for (const pokemonAbility of pokemonAbilities) {

            if(!pokemonAbility || !(typeof pokemonAbility === 'object') || !('is_hidden' in pokemonAbility) || pokemonAbility.is_hidden || !('ability' in pokemonAbility) || !(typeof pokemonAbility.ability === 'object') || !pokemonAbility.ability || !('name' in pokemonAbility.ability && 'url' in pokemonAbility.ability) || !(typeof pokemonAbility.ability.name === 'string' && typeof pokemonAbility.ability.url === 'string')) continue

            const nameAbility = pokemonAbility?.ability?.name
            const descriptionAbility = await getDescriptionPokemonAbilitie(pokemonAbility?.ability?.url)
            
            const result = {
                nameAbility,
                descriptionAbility
            }
            resultAbilities.push(result)
            
        }
        return resultAbilities

    } catch {
        return []
    }
}

async function getPokemonPageData(id:number = 1): Promise<TPokemonPageData | null>  {
    const pokemonPageData = await getPokemonData(id.toString())

    console.log(pokemonPageData)

    const pokemonSpecifications: TPokemonPageData = {
        name: pokemonPageData?.name,
        description: await getDescriptionPokemonForm(id),
        img: pokemonPageData?.sprites?.front_default || '/assets/img/001.png',
        id: pokemonPageData?.id,
        height: convertHeightToInches(pokemonPageData?.height * 10),
        weight: convertWeightToLbs(pokemonPageData?.weight / 10),
        gender: await getGendersForPokemon(pokemonPageData?.name, await getAllGendersPokemon()),
        category: await getCategoryPokemon(pokemonPageData?.name),
        abilities: await getAbilitiePokemon(pokemonPageData?.abilities),
        types: await getTypesOfPokemon(pokemonPageData?.name),
        weaknesses: await getWeaknessesOfPokemon(await getTypesOfPokemon(pokemonPageData?.name)),
        stats: pokemonPageData?.stats?.map((statValue:unknown) => {

            if(!statValue || !(typeof statValue === 'object') || !('base_stat' in statValue) || !(typeof statValue.base_stat === 'number') || !('stat' in statValue) || !(typeof statValue.stat === 'object') || !statValue.stat || !('name' in statValue.stat) || !(typeof statValue.stat.name === 'string')) return {}

            return {
                nameStat: statValue?.stat?.name,
                valueStat: statValue?.base_stat
            }
        }) || [],
    }
    console.log(pokemonSpecifications)

    return pokemonSpecifications
}

async function pokemonDataForPagination(): Promise<TPokemonIdentification | null> {
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

export {URL_API, getPokemon, getAllPokemons, pokemonDataForPagination, getPokemonPageData};