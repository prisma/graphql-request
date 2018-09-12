import { rawRequest } from '../src'

;(async () => {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

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

  const { data, errors, extensions, headers, status } = await rawRequest(
    endpoint,
    query
  )
  console.log(
    JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2)
  )
})()
