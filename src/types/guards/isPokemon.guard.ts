import type { TPokemonPageData } from "../pokemonPageData.type.ts";

export function isPokemonPreview(dataPokemon: unknown): dataPokemon is TPokemonPageData {
    return (typeof dataPokemon === 'object') && (dataPokemon !== null) && ('id' in dataPokemon) && (typeof dataPokemon.id === 'number') && ('types' in dataPokemon);
}