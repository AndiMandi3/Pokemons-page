import type { TPokemonPreview } from "./pokemonPreview.type.ts";

type TPokemonPageData = {
    name: string,
    description: TPokemonDescVersions | null,
    img: string,
    id: number,
    mainInfo: TPokemonMainInfo,
    attributes: TPokemonAttributes,
    stats: TPokemonPageDataStats[],
    evolution: TPokemonPreview[],
    dataForPagination: TNextPrevPokemons | null
}

type TPokemonAttributes = {
    types: string[],
    weaknesses: string[],
}

type TPokemonMainInfo = {
    Height: string,
    Category: string[],
    Weight: string,
    Abilities: TPokemonAbilities[],
    Gender: string[],
}

type TNextPrevPokemons = {
    next: string | null,
    previous: string | null
}

type TPokemonPageDataStats = {
    nameStat: string,
    valueStat: number
}

type TPokemonAbilities = {
    nameAbility: string,
    descriptionAbility: string
}

type TPokemonGenderData = {
    id: number,
    name: string,
    pokemon_species_details: TPokemonGenderDetail[]
}

type TPokemonGenderDetail = {
    pokemon_species: {
        name: string,
        url: string
    }
}

type TGeneraPokemonSpecies = {
    genus: string,
    language: {
        name: string,
        url: string
    }
}

type TPokemonAbility = {
    ability: {
        name: string,
        url: string
    }
    is_hidden: boolean
}

type TPokemonDescVersions =  {
    blue: string,
    red: string
}

type TPokemonAbilityDescription = {
    flavor_text: string,
    language: {
        name: string,
        url: string
    },
    version_group: {
        name: string,
        url: string
    }
}

type TPokemonAbilityDescriptionsArray = {
    flavor_text_entries: TPokemonAbilityDescription[]
}

type TPokemonDescription = {
    flavor_text: string,
    language: {
        name: string,
        url: string
    },
    version: {
        name: string,
        url: string
    }
}

type TPokemonStat = {
    base_stat: number,
    stat: TPokemonStatAlone
}

type TPokemonStatAlone = {
    name: string,
    url: string
}

type TPokemonTypes = {
    type: {
        name: string,
        url: string
    }
}

type TPokemonWeaknessesData = {
    damage_relations: {
        double_damage_from: TPokemonWeakness[]
    }
}

type TPokemonWeakness = {
    name: string,
    url: string
}

type TShortResponse = {
    name: string,
    url: string
}

type TSpeciePokemonData = {
    id: number,
    name: string,
    flavor_text_entries: TPokemonDescription[],
    genera: TGeneraPokemonSpecies[],
    evolution_chain: TPokemonEvolutionLink,
}

type TPokemonEvolutionLink = {
    url: string
}

type TPokemonEvolution = {
    id: number,
    chain: TPokemonEvolutionData
}

type TPokemonEvolutionData = {
    evolves_to: TPokemonEvolutionData[] | []
    species: {
        name: string,
        url: string
    }
}

type shortResponse = {
    next: string | null,
    previous: string | null,
    results: TShortResponse[]
}


export type {
    TPokemonPageData,
    TPokemonPageDataStats,
    TPokemonGenderData,
    TPokemonGenderDetail,
    TGeneraPokemonSpecies,
    TPokemonAbility,
    TPokemonDescVersions,
    TPokemonAbilityDescription,
    TPokemonAbilityDescriptionsArray,
    TPokemonDescription,
    TPokemonStat,
    TPokemonStatAlone,
    TPokemonTypes,
    TPokemonWeaknessesData,
    TPokemonWeakness,
    TShortResponse,
    TSpeciePokemonData,
    TPokemonEvolutionLink,
    TPokemonEvolution,
    TPokemonEvolutionData,
    shortResponse,
    TNextPrevPokemons
}