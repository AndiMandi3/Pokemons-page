import type {TPokemonSpeciesData} from "../pokemonSpeciesData.type.ts";

function isSpeciesData(dataSpecies: unknown): dataSpecies is TPokemonSpeciesData {
    return (dataSpecies as TPokemonSpeciesData).id !== undefined && (dataSpecies as TPokemonSpeciesData).flavor_text_entries !== undefined
}