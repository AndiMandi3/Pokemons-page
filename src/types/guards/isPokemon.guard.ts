import type {TPokemonPageData} from "../pokemonPageData.type.ts";

export function isPokemonPreview(dataPokemon: unknown): dataPokemon is TPokemonPageData {
    return (dataPokemon as TPokemonPageData).id !== undefined
}