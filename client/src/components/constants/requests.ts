import axios from 'axios';

export const createProposal = async (inputs: object) => {
  await axios.post("http://localhost:5000/api/createProposal", {
    method: 'POST',
    body: {...inputs},
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => console.log(res.data))
    .catch(error => console.log(error))
}

export const getProposals = async () => {
  return await axios.get("http://localhost:5000/api/proposals")
    .catch(error => console.log(error))
}