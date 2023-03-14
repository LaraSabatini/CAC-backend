const deleteDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array.map((object: T) => JSON.stringify(object)))].map(
    (object: string) => JSON.parse(object),
  )
}

export default deleteDuplicates
