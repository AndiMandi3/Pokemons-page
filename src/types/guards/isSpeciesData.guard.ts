import type { TSpeciePokemonData } from "../speciePokemonData.type.ts";


export function isSpeciesData(dataSpecies: unknown): dataSpecies is TSpeciePokemonData {
    return (
        (typeof dataSpecies === "object")
        && (dataSpecies !== null)
        && ('id' in dataSpecies)
        && ('flavor_text_entries' in dataSpecies)
        &&(typeof dataSpecies.id === 'number')
        &&(dataSpecies.flavor_text_entries !== null)
    )
}