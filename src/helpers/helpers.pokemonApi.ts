function convertHeightToInches(height: number): string {
    let result

    if (typeof height !== 'number') {
        result = 'Not found'
    } else {
        const totalInches = height / 2.54
        const feet = Math.floor(totalInches / 12)
        const inches = totalInches - feet * 12

        result = `${feet}' ${inches.toFixed(1)}"`
    }

    return result
}

function convertWeightToLbs(weight: number): number | string {
    let result

    if(typeof weight !== 'number') {
        result = 'Not found'
    }
    else {
        result = parseFloat((weight * 2.20462262).toFixed(1))
    }
    return result
}

export {convertHeightToInches, convertWeightToLbs}