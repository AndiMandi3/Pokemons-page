// type TPokemon = {
//     name: string,
//     url: string
// }

type TPokemonType = {
    slot: number,
    type: {
        name: string,
        url: string
    }
}

type TPokemonPreview = {
    id: number,
    name: string,
    types: string[],
    img: string,
}

export type {TPokemonType, TPokemonPreview}