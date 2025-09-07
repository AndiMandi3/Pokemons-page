import type { TPokemonAbility } from "../pokemonAbility.type.ts";


export function isPokemonAbilityList (element: unknown): element is TPokemonAbility {
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