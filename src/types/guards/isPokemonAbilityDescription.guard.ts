import type { TPokemonAbilityDescription } from "../pokemonAbilityDescription.type.ts";


export function isPokemonAbilityDescription (ability: unknown): ability is TPokemonAbilityDescription {
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