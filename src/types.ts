// type TPokemon = {
//     name: string,
//     url: string
// }

// TPokemonType = {
//      slot: number,
//      type: {
//          name: string,
//          url: string
//      }
// }

type TPokemonPreview = {
    id: number,
    name: string,
    types: string[],
    img: string,
}

export type {TPokemonPreview}