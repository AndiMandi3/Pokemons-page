import type { TPokemonWeaknessesData } from "../pokemonWeaknesses.typs.ts";


export function isPokemonWeaknessesData(weakness: unknown): weakness is TPokemonWeaknessesData {
    return(
        (weakness !== null)
        && (typeof weakness === "object")
        && ('damage_relations' in weakness)
        && (weakness.damage_relations !== null)
        && (typeof weakness.damage_relations === "object")
        && ('double_damage_from' in weakness.damage_relations)
        && (typeof weakness.damage_relations.double_damage_from === "object")
    )
}