"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatDate = (date) => {
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};
exports.default = formatDate;
