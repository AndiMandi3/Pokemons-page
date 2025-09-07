import type { TGeneraPokemonSpecies } from "../generaPokemonSpecies.type.ts";


export function isGeneraPokemon(element:unknown): element is TGeneraPokemonSpecies {
    return (
        (typeof element === 'object')
        &&(element !== null)
        && ('genus' in element)
        && (typeof element.genus === 'string')
    )
}