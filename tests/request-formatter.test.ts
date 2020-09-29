import { GraphQLClient, rawRequest } from '../src'
import { setupTestServer } from './__helpers'
import aws4 from 'aws4'

const ctx = setupTestServer()
const getCreds = async function() {
  return {
    accessKeyId: '123',
    secretAccessKey: '456',
    sessionToken: '789',
  }
}

describe('using requestFormatter option', () => {
  test('for signing requests for AWS Appsync & API gateway', async () => {
    const client = new GraphQLClient(ctx.url, {
      /* Custom function for signing request */
      requestFormatter: async function (payload) {
        /* Get current user creds for API call */
        const credentials = await getCreds()
      
        const { accessKeyId, secretAccessKey, sessionToken } = credentials
        if (!accessKeyId || !secretAccessKey) {
          throw new Error('Not authenticated')
        }
      
         /* Sign the request with aws4 */
        const signedRequest = aws4.sign(payload, {
          accessKeyId,
          secretAccessKey,
          sessionToken
        })
        /* Return request signed request */
        return signedRequest
      }
    })
    const mock = ctx.res()
    await client.request(`{ me { id } }`)
    expect(mock.requests[0].headers['x-amz-date']).toBeTruthy()
    expect(mock.requests[0].headers['x-amz-security-token']).toBeTruthy()
    expect(mock.requests[0].headers['authorization']).toContain('AWS4-HMAC-SHA256')
  })
})
