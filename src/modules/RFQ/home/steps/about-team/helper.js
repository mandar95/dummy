// get age-rage based on min_age
export const getMinMax = (minAge) => {
    let averageAge = "";
    switch (minAge) {
        case 0: {
            averageAge = "0-17";
            break;
        }
        case 18: {
            averageAge = "18-35";
            break;
        }
        case 36: {
            averageAge = "36-45";
            break;
        }
        case 46: {
            averageAge = "46-60";
            break;
        }
        case 60: {
            averageAge = "60-75";
            break;
        }
        default: {
        }
    }
    return averageAge;
}

export const distributeInteger = function* (total, divider) {
    if (divider === 0) {
        yield 0
    } else {
        let rest = total % divider
        let result = total / divider

        for (let i = 0; i < divider; i++) {
            if (rest-- > 0) {
                yield Math.ceil(result)
            } else {
                yield Math.floor(result)
            }
        }
    }
}
