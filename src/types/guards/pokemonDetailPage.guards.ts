import type {
    TGeneraPokemonSpecies,
    TPokemonAbility,
    TPokemonAbilityDescription,
    TPokemonAbilityDescriptionsArray,
    TPokemonDescription,
    TPokemonGenderData,
    TPokemonGenderDetail,
    TPokemonStatAlone,
    TPokemonTypes,
    TPokemonWeakness,
    TPokemonWeaknessesData,
    TShortResponse,
    TSpeciePokemonData
} from "../pokemonPage.types.ts";

function isDescriptionPokemonForm(description: unknown): description is TPokemonDescription {
    return (
        (typeof description === 'object')
        && (description !== null)
        && ('flavor_text' in description)
        && (typeof description.flavor_text === 'string')
        && ('version' in description)
        && (typeof description.version === 'object')
    )
}

function isGenderDetails(element: unknown): element is TPokemonGenderDetail {
    return (
        (element !== null)
        && (typeof element === 'object')
        && ('pokemon_species' in element)
        && (element.pokemon_species !== null)
        && (typeof element.pokemon_species === 'object')
        && ('name' in element.pokemon_species)
        && (typeof element.pokemon_species.name === 'string')
    )
}

function isGeneraPokemon(element:unknown): element is TGeneraPokemonSpecies {
    return (
        (typeof element === 'object')
        &&(element !== null)
        && ('genus' in element)
        && (typeof element.genus === 'string')
    )
}

function isGeneraLanguage(data: unknown): data is TGeneraPokemonSpecies {
    return (
        (typeof data === 'object')
        &&(data !== null)
        && ('language' in data)
        && (typeof data.language === 'object')
        && (data.language !== null)
        && ('name' in data.language)
        &&(data.language.name !== null)
        &&(typeof data.language.name === 'string')
    )
}

function isPokemonAbilityArrayDescriptions(element: unknown): element is TPokemonAbilityDescriptionsArray {
    return (
        (element !== null)
        && (typeof element === 'object')
        && ('flavor_text_entries' in element)
        && (element.flavor_text_entries !== null)
        && (typeof element.flavor_text_entries === 'object')
    )
}

function isPokemonAbilityDescription(ability: unknown): ability is TPokemonAbilityDescription {
    return (
        (ability !== null)
        && (typeof ability === 'object')
        && ('flavor_text' in ability)
        && (typeof ability.flavor_text === 'string')
        && ('version_group' in ability)
        && (typeof ability.version_group === 'object')
        && (ability.version_group !== null)
        && ('name' in ability.version_group)
        && (typeof ability.version_group.name === 'string')
        && ('language' in ability)
        && (typeof ability.language === 'object')
        && (ability.language !== null)
        && ('name' in ability.language)
        && (typeof ability.language.name === 'string')
    )
}

function isPokemonAbilityList(element: unknown): element is TPokemonAbility {
    return (
        (element !== null)
        && (typeof element === 'object')
        && ('is_hidden' in element)
        && (element.is_hidden === false)
        && (typeof element.is_hidden === 'boolean')
        && ('ability' in element)
        && (typeof element.ability === 'object')
        && (element.ability !== null)
        && ('name' in element.ability)
        && ('url' in element.ability)
        && (typeof element.ability.name === 'string')
        && (typeof element.ability.url === 'string')
    )
}

function isPokemonGender(gender: unknown): gender is TShortResponse{
    return (typeof gender === 'object') && (gender !== null) && ('name' in gender) && (typeof gender.name === 'string')
}

function isPokemonGenderData(data: unknown): data is TPokemonGenderData {
    return (data !== null) && (typeof data === 'object') && ('pokemon_species_details' in data) && (data.pokemon_species_details !== null)
}

function isPokemonStat(pokemonStat: unknown): pokemonStat is TPokemonStatAlone{
    return (
        (pokemonStat !== null)
        &&(typeof pokemonStat === 'object')
        && ('base_stat' in pokemonStat)
        && (typeof pokemonStat.base_stat === 'number')
        && ('stat' in pokemonStat)
        && (typeof pokemonStat.stat === 'object')
        && (pokemonStat.stat !== null)
        && ('name' in pokemonStat.stat)
        && (typeof pokemonStat.stat.name === 'string')
    )
}

function isPokemonType(type: unknown): type is TPokemonTypes{
    return (typeof type === 'object') && (type !== null) && ("type" in type) && (type.type !== null) && (typeof type.type === "object") && ("name" in type.type)
}

function isPokemonWeakness (weakness: unknown): weakness is TPokemonWeakness {
    return (weakness !== null) && (typeof weakness === 'object') && ("name" in weakness) && (typeof weakness.name === 'string')
}

function isPokemonWeaknessesData(weakness: unknown): weakness is TPokemonWeaknessesData {
    return(
        (weakness !== null)
        && (typeof weakness === "object")
        && ('damage_relations' in weakness)
        && (weakness.damage_relations !== null)
        && (typeof weakness.damage_relations === "object")
        && ('double_damage_from' in weakness.damage_relations)
        && (typeof weakness.damage_relations.double_damage_from === "object")
    )
}

function isSpeciesData(dataSpecies: unknown): dataSpecies is TSpeciePokemonData {
    return (
        (typeof dataSpecies === "object")
        && (dataSpecies !== null)
        && ('id' in dataSpecies)
        && ('flavor_text_entries' in dataSpecies)
        &&(typeof dataSpecies.id === 'number')
        &&(dataSpecies.flavor_text_entries !== null)
    )
}

export {
    isDescriptionPokemonForm,
    isGenderDetails,
    isGeneraPokemon,
    isGeneraLanguage,
    isPokemonAbilityArrayDescriptions,
    isPokemonAbilityDescription,
    isPokemonAbilityList,
    isPokemonGender,
    isPokemonGenderData,
    isPokemonStat,
    isPokemonType,
    isPokemonWeakness,
    isPokemonWeaknessesData,
    isSpeciesData
}