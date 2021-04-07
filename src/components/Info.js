import React from 'react'
import { useRouteMatch } from 'react-router'

function Info() {
  let match = useRouteMatch("/:table/:variable")
  console.log(match)

  let table = match.params.table
  let variable = match.params.variable

  return (
    <div>
      <h1>{table}: {variable}</h1>
    </div>
  )
}

export default Info
