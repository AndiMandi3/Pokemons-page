import type { TPokemonGenderDetail } from "./pokemonGenderDetail.type.ts";

export type TPokemonGenderData = {
    id: number,
    name: string,
    pokemon_species_details: TPokemonGenderDetail[]
}