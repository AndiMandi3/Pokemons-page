import type {TPokemonPageData, TShortResponse} from "../pokemonPage.types.ts";

function isPokemonPreview(dataPokemon: unknown): dataPokemon is TPokemonPageData {
    return (typeof dataPokemon === 'object') && (dataPokemon !== null) && ('id' in dataPokemon) && (typeof dataPokemon.id === 'number') && ('types' in dataPokemon);
}

function isPokemonShortResponse(pokemon: unknown): pokemon is TShortResponse {
    return (typeof pokemon === 'object') &&  (pokemon !== null) && ('name' in pokemon) && (typeof pokemon.name === 'string')
}

export { isPokemonPreview, isPokemonShortResponse }