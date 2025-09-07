import type {TPokemonTypes} from "../pokemonTypes.type.ts";


export function isPokemonType(type: unknown): type is TPokemonTypes{
    return (typeof type === 'object') && (type !== null) && ("type" in type) && (type.type !== null) && (typeof type.type === "object") && ("name" in type.type)
}