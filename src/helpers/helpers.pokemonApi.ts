import type { TPokemonPageDataStats, TPokemonStat } from '../types/pokemonPage.types.ts'

import { isPokemonStat } from "../types/guards/pokemonDetailPage.guards.ts";

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

    return statsArray

}

export { convertHeightToInches, convertWeightToLbs, getPokemonStats }