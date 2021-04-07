import React, { useState, useEffect, forwardRef } from 'react'
import MaterialTable from 'material-table';
import styled from 'styled-components'
import { useHistory } from 'react-router'

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { SearchOutlined } from '@material-ui/icons';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function Variables({data}) {

  const history = useHistory()

  const [term, setTerm] = useState("")
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (term.length) {
      const terms = term
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x.length)
        .map((x) => "(?=.*" + x + ")")
        .join("")

      const reg = RegExp(terms)

      const d = data
        .filter(row => reg.test(row.variable_name))

      setRows(d)
    } else {
      setRows(data)
    }
  }, [term, data])

  const columns = [
    { field: "agency", title: "Agency" },
    { field: "collection", title: "Collection" },
    // { field: "table_name", title: "Table name" },
    { field: "variable_name", title: "Variable name" },
    // { field: "variable_type", title: "Variable type" },
  ]
  const tblactions = [
    {
      icon: ChevronRight,
      tooltip: 'Details',
      onClick: (event, rowData) => setVariable(rowData)
    }
  ]

  function setVariable(row) {
    history.push(`/${row.table_name}/${row.variable_name}`)
  }

  const tabopts = {
    pageSize: 10,
    search: false,
    toolbar: false,
    actionsColumnIndex: -1,
  }

  return (
    <Container>
      <SearchContainer>
        <SearchOutlined />
        <input value={term} onChange={(e) => setTerm(e.target.value)}
          placeholder="Search ..."
         />
      </SearchContainer>

      <TableContainer>
        <DataContainer>
          <MaterialTable title="" columns={columns} actions={tblactions}
            data={rows} icons={tableIcons} options={tabopts}
            localization={{header:{actions:''}}}
            />
        </DataContainer>
      </TableContainer>
    </Container>
  )
}

export default Variables

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  @media(min-width: 600px) {
    overflow-y: scroll;
  }
`

const SearchContainer = styled.div`
  margin: 10px;
  border: solid 1px lightgray;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 10px;

  input {
    border: none;
    background: transparent;
    flex: 1;
    height: 30px;
    font-size: 1.2em;
    margin-left: 10px;
    /* text-align: center; */
  }
  input:focus {
    outline: none;
  }
`

const TableContainer = styled.div`
  flex: 1;
  margin: 10px;
`

const DataContainer = styled.div`
  flex: 1;
`
