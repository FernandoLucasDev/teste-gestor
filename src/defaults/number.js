export const toNumber = value => {
  return parseFloat(
    value.toString()
    .replace(/\./g, '')
    .replace(/\,/g, '')
  ) / 100;
}

export const maxLength = (value, length) => {
    return value.toString().slice(0, length)
}