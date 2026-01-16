export const HandleError = (func) => (...arg) => {
    try {
        return func(...arg)
    } catch (error) {
        console.log(error);
        return null
    }
}