import type {TPokemonPreview} from "../types/pokemonPreview.type.ts";
import type { TPokemonPageData } from "../types/pokemonPageData.type.ts";
import type { TSpeciePokemonData } from "../types/speciePokemonData.type.ts";
import type { TGeneraPokemonSpecies } from "../types/generaPokemonSpecies.type.ts";
import type { TPokemonAbility } from "../types/pokemonAbility.type.ts";
import type {TPokemonAbilityDescription} from "../types/pokemonAbilityDescription.type.ts";

import {convertHeightToInches, convertWeightToLbs, getPokemonStats} from "../helpers/helpers.pokemonApi.ts";

import { isPokemonPreview } from "../types/guards/isPokemon.guard.ts";
import { isPokemonShortResponse } from "../types/guards/isPokemonShortResponse.guard.ts";
import { isDescriptionPokemonForm } from "../types/guards/isDescriptionPokemonForm.guard.ts";
import { isSpeciesData } from "../types/guards/isSpeciesData.guard.ts";
import { isGeneraLanguage } from "../types/guards/isGeneraLanguage.guard.ts";
import { isGeneraPokemon } from "../types/guards/isGenera.guard.ts";
import { isPokemonGender } from "../types/guards/isPokemonGender.guard.ts";
import { isGenderDetails } from "../types/guards/isGenderDetails.guard.ts";
import { isPokemonGenderData } from "../types/guards/isPokemonGenderData.guard.ts";
import { isPokemonType } from "../types/guards/isPokemonType.guard.ts";
import { isPokemonWeaknessesData } from "../types/guards/isPokemonWeaknessData.guard.ts";
import { isPokemonWeakness } from "../types/guards/isPokemonWeakness.guard.ts";
import { isPokemonAbilityList } from "../types/guards/isPokemonAbilityList.guard.ts";
import { isPokemonAbilityArrayDescriptions } from "../types/guards/isPokemonAbilityArrayDescriptions.guard.ts";
import {isPokemonAbilityDescription} from "../types/guards/isPokemonAbilityDescription.guard.ts";

const URL_API:string = import.meta.env.VITE_URL_API

async function getPokemon(pokemonName: string): Promise<TPokemonPreview | null> {
    try {
        if (!pokemonName) return null

        const dataPokemon = await getPokemonData(pokemonName);
        
        return {
            id: dataPokemon?.id,
            name: dataPokemon?.name,
            types: await getTypesOfPokemon(dataPokemon?.name),
            img: dataPokemon?.sprites?.front_default || '/assets/img/001.png'
        }
    } catch {
        return null;
    }
}

async function getPokemonData(pokemonName: string) {
    try {
        if(!pokemonName) return null

        const urlPokemon = await fetch(`${URL_API}/pokemon/${pokemonName}`)
        const dataPokemon = await urlPokemon.json()

        if(!dataPokemon && isPokemonPreview(dataPokemon)) return null
        return dataPokemon
    } catch {
        return null
    }
}

async function getPokemonSpeciesData(pokemonName: string): Promise<TSpeciePokemonData | null> {
    try {
        if(!pokemonName) return null

        const json = await fetch (URL_API + `/pokemon-species/${pokemonName}`)
        const data = await json.json()

        if (!data || !isSpeciesData(data)) return null

        return data
    } catch {
        return null
    }

}

await getPokemonSpeciesData('bulbasaur')

async function getAllPokemons(limit: number = 12): Promise<TPokemonPreview[]> {
    try {
        const json = await fetch(URL_API + `/pokemon?limit=${limit}&offset=0`);
        const data = await json.json()

        const allPokemons: TPokemonPreview[] = []

        for (const element of data.results) {
            if(!element || !isPokemonShortResponse(element)) continue

            const pokemonData = await getPokemon(element.name)

            if (pokemonData) allPokemons.push(pokemonData)
        }
        return allPokemons

    } catch {
        return []
    }
}

async function getDescriptionPokemonForm(id: number = 1):Promise<string>  {
    try {
        const data: TSpeciePokemonData | null = await getPokemonSpeciesData(id.toString());

        if(!data) return 'No data';

        const allDescriptions = data.flavor_text_entries

        let description = 'No data'

        for (const pokemonDescription of allDescriptions) {
            if (!pokemonDescription || !isDescriptionPokemonForm(pokemonDescription)) return 'No data'

            if (pokemonDescription.version.name === 'diamond') {
                description = pokemonDescription.flavor_text
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
        if(!pokemonName) return []

        const allCategories: string[] = []
        const specieSpecification: TSpeciePokemonData | null = await getPokemonSpeciesData(pokemonName)

        if(!specieSpecification) return []

        const genera:TGeneraPokemonSpecies[] = specieSpecification.genera

        const categoriesFiltered:TGeneraPokemonSpecies[] = genera.filter((element:unknown) => {
            if( !element || !isGeneraLanguage(element)) return []

            return element.language.name === 'en'
        })

        categoriesFiltered.forEach((element:unknown) => {
            if( !element || !isGeneraPokemon(element)) return
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
            if(!gender || !isPokemonGender(gender)) continue

            allGenders.push(gender.name)
        }

        return allGenders
    } catch {
        return []
    }
    
}

async function getGendersForPokemon(name: string, genders: string[]): Promise<string[]> {
    try {
        if(!name || !genders || !genders.length) return []

        const arrayGenders: string[] = []
        for (const gender of genders) {

            const genderChosen = await fetch(URL_API + `/gender/${gender}`)
            const genderData = await genderChosen.json()

            if(!genderData || !isPokemonGenderData(genderData)) return []

            for (const element of genderData.pokemon_species_details) {
                if (!element || !isGenderDetails(element)) continue;

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
        if (!name) return []
        const dataTypes = await getPokemonData(name)

        return dataTypes?.types?.map((pokemon: unknown): string => {
            if(!pokemon || !isPokemonType(pokemon)) return ""

            return pokemon?.type?.name

        }) || []
    } catch {
        return []
    }
    
}

async function getWeaknessesOfPokemon(types: string[]): Promise<string[]> {
    try {
        if(!types) return []

        const allWeaknesses: string[] = []

        for (const type of types) {
            const urlType = await fetch(`${URL_API}/type/${type}`)
            const dataType = await urlType.json()

            if(!dataType || !isPokemonWeaknessesData(dataType)) return []

            for (const weakness of dataType.damage_relations.double_damage_from){
                if(!weakness || !isPokemonWeakness(weakness)) return []

                allWeaknesses.push(weakness?.name)
            }
        }
        return allWeaknesses
    } catch {
        return []
    }
    
}



async function getDescriptionPokemonAbility(url:string): Promise<string> {
    try {
        if( !url ) return 'No data'

        const jsonDescription = await fetch(url)
        const abilityDescriptions = await jsonDescription.json()

        if(!abilityDescriptions || !isPokemonAbilityArrayDescriptions(abilityDescriptions)) return 'No data'

        const arrayDescriptions:TPokemonAbilityDescription[] = abilityDescriptions.flavor_text_entries

        let descriptionAbility

        for (const description of arrayDescriptions) {
            if( !description || !isPokemonAbilityDescription(description)) return 'No data'

            if(description.version_group.name === 'scarlet-violet' || description.language.name === 'en') {
                descriptionAbility = description?.flavor_text
                break
            }
        }
        return descriptionAbility || 'No data'
    } catch {
        return 'No data'
    }
    
}

async function getAbilityPokemon(pokemonAbilities: TPokemonAbility[]) {
    try {
        if( !pokemonAbilities ) return []

        const resultAbilities= []
        for (const pokemonAbility of pokemonAbilities) {

            if(!pokemonAbility || !isPokemonAbilityList(pokemonAbility)) continue

            const nameAbility = pokemonAbility.ability.name
            const descriptionAbility = await getDescriptionPokemonAbility(pokemonAbility.ability.url)
            
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

    const pokemonSpecifications: TPokemonPageData = {
        name: pokemonPageData?.name,
        description: await getDescriptionPokemonForm(id),
        img: pokemonPageData?.sprites?.front_default || '/assets/img/001.png',
        id: pokemonPageData?.id,
        height: convertHeightToInches(pokemonPageData?.height * 10),
        weight: convertWeightToLbs(pokemonPageData?.weight / 10),
        gender: await getGendersForPokemon(pokemonPageData?.name, await getAllGendersPokemon()),
        category: await getCategoryPokemon(pokemonPageData?.name),
        abilities: await getAbilityPokemon(pokemonPageData?.abilities),
        types: await getTypesOfPokemon(pokemonPageData?.name),
        weaknesses: await getWeaknessesOfPokemon(await getTypesOfPokemon(pokemonPageData?.name)),
        stats: getPokemonStats(pokemonPageData?.stats) || []
    }
    console.log(pokemonSpecifications)

    return pokemonSpecifications
}

export {URL_API, getPokemon, getAllPokemons, getPokemonPageData};