import { GraphQLClient } from '../src'

;(async () => {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    credentials: 'include',
    mode: 'cors',
  })

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const data = await graphQLClient.request(query)
  console.log(JSON.stringify(data, undefined, 2))
})()
