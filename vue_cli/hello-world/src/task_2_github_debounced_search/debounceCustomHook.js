const debouncedFunction = function (callback, delay) {
    let timerRef = null

    return function (...args) {
        if (timerRef) {
            clearTimeout(timerRef)
        }
        timerRef = setTimeout(() => {
            callback(...args)
        },delay)
    }
}

export default debouncedFunction