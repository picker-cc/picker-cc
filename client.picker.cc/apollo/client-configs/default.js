import { HttpLink } from 'apollo-link-http'
// import { InMemoryCache } from 'apollo-cache-inmemory'

// Replace this with your project's endpoint
// const GRAPHCMS_API = 'https://api-useast.graphcms.com/v1/cjiacyow100ob01eqwnghonw2/master'
const GRAPHCMS_API = 'http://localhost:8000/sns-api'

export default () => ({
  link: new HttpLink({ uri: GRAPHCMS_API }),
  // cache: new InMemoryCache(),
  defaultHttpLink: false
})
