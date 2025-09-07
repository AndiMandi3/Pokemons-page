import type { TPokemonGenderDetail } from "../pokemonGenderDetail.type.ts";


export function isGenderDetails (element: unknown): element is TPokemonGenderDetail {
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