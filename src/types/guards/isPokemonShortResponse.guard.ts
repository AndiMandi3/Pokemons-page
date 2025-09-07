import type {TShortResponse} from "../shortResponse.type.ts";

export function isPokemonShortResponse(pokemon: unknown): pokemon is TShortResponse {
    return (typeof pokemon === 'object') &&  (pokemon !== null) && ('name' in pokemon) && (typeof pokemon.name === 'string')
}