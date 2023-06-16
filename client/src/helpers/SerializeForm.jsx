export const SerializeForm = form => {
  const formData = new FormData(form)
  const updatedObject = {}

  for (let [name, value] of formData) {
    updatedObject[name] = value
  }

  return updatedObject
}
