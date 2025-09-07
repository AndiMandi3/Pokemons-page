import type {TPokemonStatAlone} from "../pokemonStatAlone.type.ts";


export function isPokemonStat (pokemonStat: unknown): pokemonStat is TPokemonStatAlone{
    return (
        (pokemonStat !== null)
        &&(typeof pokemonStat === 'object')
        && ('base_stat' in pokemonStat)
        && (typeof pokemonStat.base_stat === 'number')
        && ('stat' in pokemonStat)
        && (typeof pokemonStat.stat === 'object')
        && (pokemonStat.stat !== null)
        && ('name' in pokemonStat.stat)
        && (typeof pokemonStat.stat.name === 'string')
    )
}