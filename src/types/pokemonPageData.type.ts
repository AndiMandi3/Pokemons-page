import type { TPokemonAbility } from "./pokemonAbility.type"

export type TPokemonPageData = {
    name: string,
    description: string,
    img: string,
    id: number,
    height: string,
    weight: number | string,
    gender: string[],
    category: string[],
    abilities: TPokemonAbility[],
    types: string[],
    weaknesses: string[],
    stats: [{
        nameStat: string,
        valueStat: number
    }],
}