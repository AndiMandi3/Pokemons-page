import type { TShortResponse } from "../shortResponse.type.ts";


export function isPokemonGender (gender: unknown): gender is TShortResponse{
    return (typeof gender === 'object') && (gender !== null) && ('name' in gender) && (typeof gender.name === 'string')
}