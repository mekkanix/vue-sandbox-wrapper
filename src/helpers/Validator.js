export const isValidPropName = (name) => {
  // return ![null, undefined,].includes(name) ? name.toString().search(/^([a-zA-Z_\$])([a-zA-Z0-9_\$])*$/i) !== -1 : false
  return ![null, undefined,].includes(name) && name.length
}

export const isValidCodePrimitiveValue = (value) => {
  // NOTE: Use this code basis if custom validation processes/errors are needed.
  // For now, simple `JSON.parse` error handling makes the trick for generic error management.
  // ("Don't reinvent the wheel, huh?")
  // ==========
  /* const stringDelimiters = value.match(/"|'/g)
  const validString = !!(stringDelimiters && stringDelimiters.length === 2)
  const validBoolean = ['true', 'false',].includes(value)
  const validNumber = !isNaN(parseInt(value))
  console.log(value, validString, validBoolean, validNumber);
  return validString || validBoolean || validNumber */
  const primitives = ['boolean', 'string', 'number', 'date',]
  const specialValues = ['null', 'false', '""']

  try {
    if (specialValues.includes(value) || JSON.parse(value)) {
      const parsedValue = JSON.parse(value)
      // console.log(parsedValue);
      if (parsedValue === null || primitives.includes(typeof parsedValue)) {
        return true
      }
      if (typeof parsedValue === 'object' || Array.isArray(parsedValue)) {
        return false
      }
      return true
    }
  } catch (e) {
    return false
  }
}
