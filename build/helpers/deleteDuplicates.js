"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deleteDuplicates = (array) => {
    return [...new Set(array.map((object) => JSON.stringify(object)))].map((object) => JSON.parse(object));
};
exports.default = deleteDuplicates;
