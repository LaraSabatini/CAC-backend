const getOffset = (listPerPage, currentPage = 1) => {
    return (currentPage - 1) * listPerPage;
};
const calcTotalPages = (amountOfPages) => {
    return Math.ceil(Object.values(parseInt(amountOfPages[0], 10))[0] / 25);
};
export { getOffset, calcTotalPages };
