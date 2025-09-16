import type { TPokemonPreview } from "../types/pokemonPreview.type.ts";
import type {
    TPokemonPageData,
    TSpeciePokemonData,
    TGeneraPokemonSpecies,
    TPokemonAbility,
    TPokemonAbilityDescription,
    TPokemonEvolutionData,
    TPokemonTypes,
    TNextPrevPokemons
} from "../types/pokemonPage.types.ts";

import { convertHeightToInches, convertWeightToLbs, getPokemonStats } from "../helpers/helpers.pokemonApi.ts";

import { isPokemonPreview, isPokemonShortResponse } from "../types/guards/pokemonListPage.guards.ts";
import {
    isDescriptionPokemonForm,
    isSpeciesData,
    isGeneraLanguage,
    isGeneraPokemon,
    isPokemonGender,
    isGenderDetails,
    isPokemonGenderData,
    isPokemonType,
    isPokemonWeaknessesData,
    isPokemonWeakness,
    isPokemonAbilityList,
    isPokemonAbilityArrayDescriptions,
    isPokemonAbilityDescription,
    isPokemonEvolutionLink,
    isPokemonEvolutionData,
    isPokemonEvolutionChainData, isShortResponse, isShortResponseForTypes, isShortResponseForAbilities,
    isShortResponseForPagination,

} from "../types/guards/pokemonDetailPage.guards.ts";


const URL_API:string = import.meta.env.VITE_URL_API

async function getPokemon(pokemonName: string): Promise<TPokemonPreview | null> {
    try {
        if (!pokemonName) return null

        const dataPokemon = await getPokemonData(pokemonName);
        
        return {
            id: dataPokemon?.id,
            name: dataPokemon?.name,
            types: await getTypesOfPokemon(dataPokemon?.types),
            img: dataPokemon?.sprites?.front_default || '/assets/img/001.png'
        }
    } catch {
        return null
    }
}

async function getPokemonData(pokemonName: string) {
    try {
        if(!pokemonName) return null

        const urlPokemon = await fetch(URL_API + `/pokemon/${pokemonName}`)
        const dataPokemon = await urlPokemon.json()

        if(!dataPokemon && isPokemonPreview(dataPokemon)) return null

        return dataPokemon
        
    } catch {
        return null
    }
}

async function getAllTypesOfPokemon(): Promise<string[]> {
    try {
        const urlAllTypes = await fetch(URL_API + `/type?limit=1000&offset=0`)
        const dataAllTypes = await urlAllTypes.json()

        if(!dataAllTypes || !isShortResponse(dataAllTypes)) return []

        return dataAllTypes?.results?.map((type:unknown) => {
            if(!type || !isShortResponseForTypes(type)) return ""

            return type?.name
        }) || []
    } catch {
        return []
    }
}

async function getAllAbilitiesOfPokemon(): Promise<string[]> {
    try {
        const urlAllAbilities = await fetch(URL_API + `/ability?limit=1000&offset=0`)
        const dataAllAbilities = await urlAllAbilities.json()

        if(!dataAllAbilities || !isShortResponse(dataAllAbilities)) return []

        return dataAllAbilities?.results?.map((ability:unknown) => {
            if(!ability || !isShortResponseForAbilities(ability)) return ""

            return ability?.name
        }) || []
    } catch {
        return []
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

async function getDescriptionPokemonForm(pokemonName: string):Promise<string>  {
    try {
        const data: TSpeciePokemonData | null = await getPokemonSpeciesData(pokemonName);

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

async function getTypesOfPokemon(types: TPokemonTypes[]): Promise<string[]> {
    try {
        if (!types) return []

         return types?.map((pokemon: unknown): string => {
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

async function getPokemonPageData(name: string = 'bulbasaur'): Promise<TPokemonPageData | null>  {
    try {
        const pokemonPageData = await getPokemonData(name)

        const pokemonSpecifications: TPokemonPageData = {
            name: pokemonPageData?.name,
            description: await getDescriptionPokemonForm(name),
            img: pokemonPageData?.sprites?.front_default || '/assets/img/001.png',
            id: pokemonPageData?.id,
            height: convertHeightToInches(pokemonPageData?.height * 10),
            weight: convertWeightToLbs(pokemonPageData?.weight / 10),
            gender: await getGendersForPokemon(pokemonPageData?.name, await getAllGendersPokemon()),
            category: await getCategoryPokemon(pokemonPageData?.name),
            abilities: await getAbilityPokemon(pokemonPageData?.abilities),
            types: await getTypesOfPokemon(pokemonPageData?.types),
            weaknesses: await getWeaknessesOfPokemon(await getTypesOfPokemon(pokemonPageData?.types)),
            stats: getPokemonStats(pokemonPageData?.stats) || [],
            evolution: await getPokemonEvolutionChain(pokemonPageData?.name),
            dataForPagination: await paginationForDetailPage(pokemonPageData?.id)
        }
        console.log(pokemonSpecifications)

        return pokemonSpecifications
    } catch {
        return null
    }

}

async function getPokemonEvolutionChain(pokemonName: string) :Promise<TPokemonPreview[]> {
    try {
        const speciePokemon =  await getPokemonSpeciesData(pokemonName)
        if(!speciePokemon || !isPokemonEvolutionLink(speciePokemon)) return []

        const evolutionJson = await fetch (speciePokemon.evolution_chain.url)
        const evolutionData = await evolutionJson.json()

        if(!evolutionData || !isPokemonEvolutionData(evolutionData)) return []

        const evolutionDataChain:TPokemonEvolutionData = evolutionData.chain

        return await pokemonEvolutionTree(evolutionDataChain)
    } catch {
        return []
    }
}

async function pokemonEvolutionTree(evolutionData: TPokemonEvolutionData): Promise<TPokemonPreview[]> {
    const evolutionList: TPokemonPreview[] = []

    async function traverse(node: TPokemonEvolutionData) {
        if (node && isPokemonEvolutionChainData(node)) {
            const pokemon = await getPokemon(node.species.name)
            if(pokemon) {
                evolutionList.push(pokemon)
            }
        }

        if (node.evolves_to && node.evolves_to.length > 0) {
             for(const evolve of node.evolves_to) {
                await traverse(evolve)
            }
        }
    }

    await traverse(evolutionData)

    return evolutionList
}

async function paginationForDetailPage(id: number): Promise<TNextPrevPokemons | null> {
    try {
        const data = await fetch(URL_API + `/pokemon?limit=1&offset=${id-1}`)
        const json = await data.json()

        if(!json || !isShortResponse(json)) return null

        async function getPaginationDetails(nextUrl: string | null, prevUrl: string | null): Promise<TNextPrevPokemons | null> {
            const result = {
                nextName: nextUrl ? '' : null,
                prevName: prevUrl ? '' : null
            }

            if(nextUrl) {
                const dataNextUrl = await fetch(nextUrl)
                const jsonNextUrl = await dataNextUrl.json()

                if(!jsonNextUrl || !isShortResponse(jsonNextUrl)) return null

                for(const dataNextUrl of jsonNextUrl.results) {
                    if(!dataNextUrl || !isShortResponseForPagination(dataNextUrl)) continue

                    result.nextName = dataNextUrl.name
                    break
                }
            }

            if(prevUrl) {
                const dataPrevUrl = await fetch(prevUrl)
                const jsonPrevUrl = await dataPrevUrl.json()

                if(!jsonPrevUrl || !isShortResponse(jsonPrevUrl)) return null

                for(const dataPrevUrl of jsonPrevUrl.results) {
                    if(!dataPrevUrl || !isShortResponseForPagination(dataPrevUrl)) continue

                    result.nextName = dataPrevUrl.name
                    break
                }
            }
            return result
        }
        return await getPaginationDetails(json.next, json.previous)
    } catch {
        return null
    }
}


export { URL_API, getPokemon, getAllPokemons, getPokemonPageData, getAllTypesOfPokemon, getAllAbilitiesOfPokemon }