function convertHeightToInches(height: number): string {
    const totalInches = height / 2.54
    const feet = Math.floor(totalInches / 12)
    const inches = totalInches - feet * 12

    return  `${feet}' ${inches.toFixed(1)}"`
}

function convertWeightToLbs(weight: number): number | string {
    return parseFloat((weight * 2.20462262).toFixed(1))
}

export {convertHeightToInches, convertWeightToLbs}