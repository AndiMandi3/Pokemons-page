import type { TGeneraPokemonSpecies } from "../generaPokemonSpecies.type.ts";

export function isGeneraLanguage(data: unknown): data is TGeneraPokemonSpecies {
    return (
        (typeof data === 'object')
        &&(data !== null)
        && ('language' in data)
        && (typeof data.language === 'object')
        && (data.language !== null)
        && ('name' in data.language)
        &&(data.language.name !== null)
        &&(typeof data.language.name === 'string')
    )
}