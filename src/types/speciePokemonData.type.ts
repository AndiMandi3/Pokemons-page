import type { TPokemonDescription } from "./pokemonDescription.type.ts";
import type { TGeneraPokemonSpecies } from "./generaPokemonSpecies.type.ts";

export type TSpeciePokemonData = {
    id: number,
    name: string,
    flavor_text_entries: TPokemonDescription[],
    genera: TGeneraPokemonSpecies[]
}