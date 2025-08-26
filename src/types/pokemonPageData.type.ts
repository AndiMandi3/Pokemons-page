export type TPokemonPageData = {
    name: string,
    description: string,
    img: string,
    id: number,
    height: number,
    weight: number,
    gender: string[],
    category: string,
    types: string[],
    weaknesses: string,
    stats: [{
        name_stat: string,
        value_stat: number
    }],
}