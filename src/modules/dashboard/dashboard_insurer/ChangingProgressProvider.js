import { useState, useEffect } from "react";

const ChangingProgressProvider = (props) => {

    const [valuesIndex, setValuesIndex] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setValuesIndex((valuesIndex + 1) % props.values.length);
        }, props.interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return props.children(props.values[valuesIndex]);
}


ChangingProgressProvider.defaultProps = {
    interval: 0
}

export default ChangingProgressProvider;
