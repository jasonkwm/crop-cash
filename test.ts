import { gql, request } from 'graphql-request'
const query = gql`{
  fundsDepositeds(first: 5) {
    id
    requestId
    lender
    amount
  }
  fundsWithdrawns(first: 5) {
    id
    requestId
    borrower
    totalAmount
  }
}`
const url = 'https://api.studio.thegraph.com/query/94953/test-crop-cash/version/latest'
async function fetchSubgraphData() {
  return await request(url, query)
}
fetchSubgraphData().then((data) => console.log({data})).catch(console.error)
      