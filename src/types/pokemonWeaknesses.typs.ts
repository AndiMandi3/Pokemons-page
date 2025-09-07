import type { TPokemonWeakness } from "./guards/pokemonWeakness.type.ts";

export type TPokemonWeaknessesData = {
    damage_relations: {
        double_damage_from: TPokemonWeakness[]
    }
}