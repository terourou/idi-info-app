import React, { useState, useEffect } from 'react'
import { readRemoteFile } from 'react-papaparse'
import { DataGrid } from '@material-ui/data-grid'
import styled from 'styled-components'
import { useHistory } from 'react-router'


function Variables() {

  const history = useHistory()

  const [term, setTerm] = useState("")
  const [data, setData] = useState([])
  const [rows, setRows] = useState([])

  useEffect(() => {
    readRemoteFile(
      "/data.csv",
      {
        header: true,
        complete: (results) => {
          console.log("DATA LOADED")
          setData(results.data.filter(row => row.variable_name))
        }
      }
    )
  }, [])

  useEffect(() => {
    setRows(data)
  }, [data])

  useEffect(() => {
    const d = data.filter(row => {
      return row.variable_name.match(term)
    })
    setRows(d)
  }, [term, data])

  const columns = [
    { field: "table_name", headerName: "Table name", flex: 1 },
    { field: "variable_name", headerName: "Variable name", flex: 1 },
    { field: "variable_type", headerName: "Variable type", flex: 1 },
  ]

  function setVariable(row) {
    console.log(row)
    history.push(`/${row.row.table_name}/${row.row.variable_name}`)
  }

  return (
    <Container>
      <SearchContainer>
        <input value={term} onChange={(e) => setTerm(e.target.value)} />
      </SearchContainer>

      <TableContainer>
        <DataContainer>
          <DataGrid
            rows={rows}
            columns={columns}
            autoPageSize
            onRowClick={(row) => setVariable(row)}
            />
        </DataContainer>
      </TableContainer>
    </Container>
  )
}

export default Variables

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const SearchContainer = styled.div`
  margin: 10px;
`

const TableContainer = styled.div`
  flex: 1;
  display: flex;
  margin: 10px;
`

const DataContainer = styled.div`
  flex: 1;
`
