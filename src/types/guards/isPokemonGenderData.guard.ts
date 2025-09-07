import type { TPokemonGenderData } from "../genderData.type.ts";


export function isPokemonGenderData(data: unknown): data is TPokemonGenderData {
    return (data !== null) && (typeof data === 'object') && ('pokemon_species_details' in data) && (data.pokemon_species_details !== null)
}