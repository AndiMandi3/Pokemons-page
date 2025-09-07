import type {TPokemonWeakness} from "./pokemonWeakness.type.ts";


export function isPokemonWeakness (weakness: unknown): weakness is TPokemonWeakness {
    return (weakness !== null) && (typeof weakness === 'object') && ("name" in weakness) && (typeof weakness.name === 'string')
}