"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcTotalPages = exports.getOffset = void 0;
const getOffset = (listPerPage, currentPage = 1) => {
    return (currentPage - 1) * listPerPage;
};
exports.getOffset = getOffset;
const calcTotalPages = (amountOfPages) => {
    return Math.ceil(Object.values(parseInt(amountOfPages[0], 10))[0] / 25);
};
exports.calcTotalPages = calcTotalPages;
