const deleteDuplicates = (array) => {
    return [...new Set(array.map((object) => JSON.stringify(object)))].map((object) => JSON.parse(object));
};
export default deleteDuplicates;
