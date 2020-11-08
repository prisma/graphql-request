import { createReadStream } from 'fs'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { join } from 'path'
import { gql, request } from '../src'
import { createApolloServerContext } from './__helpers'

const typeDefs = `
  scalar Upload

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    uploadFile(file: Upload!): String!
  }

  type User {
    id: Int!
  }
`

export const users = [{ id: 1 }, { id: 2 }, { id: 3 }]

const resolvers = {
  Query: {
    users: () => Promise.resolve(users),
    user: (source: any, { id }: { id: number }) =>
      Promise.resolve(users.find((user) => user.id === id) || null),
  },
  Mutation: {
    async uploadFile(source: any, { file }: { file: Promise<FileUpload> }) {
      const { filename } = await file
      return filename
    },
  },
  Upload: GraphQLUpload as any,
}

const ctx = createApolloServerContext({ typeDefs, resolvers })

beforeEach(() => {
  ;(global as any).FormData = undefined
})

const fileName = 'upload.test.ts'

test('file upload using global.FormData', async () => {
  ;(global as any).FormData = FormData

  const query = gql`
    mutation uploadFile($file: Upload!) {
      uploadFile(file: $file)
    }
  `

  const result = await request(ctx.url, query, {
    file: createReadStream(join(__dirname, fileName)),
  })

  expect(result).toEqual({ data:{uploadFile: fileName} })
})

test('file upload still works if no global.FormData provided', async () => {
  const query = gql`
    mutation uploadFile($file: Upload!) {
      uploadFile(file: $file)
    }
  `

  const result = await request(ctx.url, query, {
    file: createReadStream(join(__dirname, fileName)),
  })

  expect(result).toEqual({ data:{uploadFile: fileName }})
})
