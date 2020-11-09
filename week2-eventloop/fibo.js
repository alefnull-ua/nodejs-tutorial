function fiboNth(n) {
    if (n == 0) return 1;
    if (n == 1) return 1;
    return fiboNth(n-2) + fiboNth(n-1);
}
module.exports = {
    getNth: (n) =>  { return fiboNth(n) }
}