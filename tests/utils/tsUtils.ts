export const isNumberArraySortedAscending = (arr: number[]): boolean => {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}


export const isNumberArraySortedDescending = (arr: number[]): boolean => {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < arr[i + 1]) {
            return false;
        }
    }
    return true;
}