export type TPokemonPageData = {
    name: string,
    description: string,
    img: string,
    id: number,
    height: string,
    weight: number | string,
    gender: string[],
    category: string,
    types: string[],
    weaknesses: string[],
    stats: [{
        name_stat: string,
        value_stat: number
    }],
}