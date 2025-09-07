import type { TPokemonAbilityDescriptionsArray } from "../pokemonAbilityDescriptionsArray.type.ts";


export function isPokemonAbilityArrayDescriptions(element: unknown): element is TPokemonAbilityDescriptionsArray {
    return (
        (element !== null)
        && (typeof element === 'object')
        && ('flavor_text_entries' in element)
        && (element.flavor_text_entries !== null)
        && (typeof element.flavor_text_entries === 'object')
    )
}