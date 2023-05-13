export const SerializeForm = form => {
  const formData = new FormData(form)
  const updatedObject = {}

  console.log(formData)
  console.log()

  for (let [name, value] of formData) {
    updatedObject[name] = value
  }

  return updatedObject
}
