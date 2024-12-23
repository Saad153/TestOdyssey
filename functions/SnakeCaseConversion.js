function snakeCaseConversion(str) {
    const arr = str.split('')
    // console.log("arr",arr[0])
    arr[0] = arr[0].toUpperCase();
    str = arr.join('');
    str = str.split("_").join(" ")
    // console.log("str",str)
    // // str.join(' ')
    // console.log(str)
    return str
}

export default snakeCaseConversion