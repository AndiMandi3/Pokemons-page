import type {TPokemonDescription} from "../pokemonDescription.type.ts";

export function isDescriptionPokemonForm(description: unknown): description is TPokemonDescription {
    return (
        (typeof description === 'object')
        && (description !== null)
        && ('flavor_text' in description)
        && (typeof description.flavor_text === 'string')
        && ('version' in description)
        && (typeof description.version === 'object')
    )
}