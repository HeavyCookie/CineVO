import React, { useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Search } from 'semantic-ui-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import styled from '@emotion/styled'

import { search, searchVariables } from './__generated__/search'

const SEARCH_QUERY = gql`
  query search($q: String!) {
    searchTheater(q: $q) {
      id
      name
      street
      postcode
      city
    }
  }
`

const SearchBox = styled.div`
  display: flex;
  justify-content: center;
`

export const SearchTheaters = withRouter((props: RouteComponentProps<{}>) => {
  const [requestSearch, { loading, data }] = useLazyQuery<
    search,
    searchVariables
  >(SEARCH_QUERY, { fetchPolicy: 'network-only' })
  const [q, setQ] = useState<string | undefined>()
  const [results, setResults] = useState<
    undefined | { title: string; description: string }[]
  >()

  // Handle search launch
  useEffect(() => {
    if (!q || q.length < 2) return

    requestSearch({ variables: { q } })
  }, [q])

  // Handle search formatting
  useEffect(() => {
    if (!data) setResults(undefined)
    const results = data?.searchTheater.map(r => ({
      id: r.id,
      title: r.name,
      description: `${r.postcode} ${r.city}`,
    }))
    setResults(results)
  }, [data])

  return (
    <SearchBox>
      <Search
        loading={loading}
        onSearchChange={(e, { value }) => setQ(value)}
        value={q}
        results={results}
        onResultSelect={(_, { result }) =>
          props.history.push(`/theaters/${result.id}`)
        }
      />
    </SearchBox>
  )
})
