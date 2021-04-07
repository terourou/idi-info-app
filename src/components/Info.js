import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'

function Info({data}) {

  const [info, setInfo] = useState({})

  let match = useRouteMatch("/:table/:variable")


  useEffect(() => {
    let table = match.params.table
    let variable = match.params.variable
    const d = data.filter(d => d.table_name === table && d.variable_name === variable)
    if (d.length) setInfo(d[0])
  }, [data, match])


  return (
    <div>
      <ul>
        <li>Agency: {info?.agency}</li>
        <li>Collection: {info?.collection}</li>
        <li>Schema: {info?.schema}</li>
        <li>Table: {info?.table_name}</li>
        <li>Variable: {info?.variable_name}</li>
        <li>Vartype: {info?.variable_type}</li>
      </ul>
    </div>
  )
}

export default Info
