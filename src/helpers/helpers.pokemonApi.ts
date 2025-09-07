import type { TPokemonPageDataStats } from "../types/pokemonPageDataStats.type.ts";
import type { TPokemonStat } from "../types/pokemonStat.type.ts";

import { isPokemonStat } from "../types/guards/isPokemonStat.guard.ts";

function convertHeightToInches(height: number): string {
    const totalInches = height / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = totalInches - feet * 12

    return  `${feet}' ${inches.toFixed(1)}"`
}

function convertWeightToLbs(weight: number): number | string {
    return parseFloat((weight * 2.20462262).toFixed(1))
}

function getPokemonStats (pokemonStats: TPokemonStat[]):TPokemonPageDataStats[] {
    if(!pokemonStats.length) return []

    const statsArray:TPokemonPageDataStats[] = []

    for (const pokemonStat of pokemonStats) {
        if(!pokemonStat || !isPokemonStat(pokemonStat)) continue

        statsArray.push({
            nameStat: pokemonStat.stat.name,
            valueStat: pokemonStat.base_stat
        })
    }

    console.log(pokemonStats)
    return statsArray

}

export {convertHeightToInches, convertWeightToLbs, getPokemonStats}