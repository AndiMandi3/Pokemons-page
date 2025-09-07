import type { TPokemonPageDataStats } from "./pokemonPageDataStats.type.ts";

export type TPokemonPageData = {
    name: string,
    description: string,
    img: string,
    id: number,
    height: string,
    weight: number | string,
    gender: string[],
    category: string[],
    abilities: {
        nameAbility: string,
        descriptionAbility: string
    }[],
    types: string[],
    weaknesses: string[],
    stats: TPokemonPageDataStats[],
}