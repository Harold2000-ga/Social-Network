import { Global } from './Global'

export const GetProfile = (id, setState) => {
  return fetch(`${Global.url}/user/profile/${id}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.status == 'Success') {
        setState(data.user)

        return data
      }
    })
}
