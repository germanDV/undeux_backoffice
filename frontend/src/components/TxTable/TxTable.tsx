import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { PaperContainer } from 'ui/paper.styles'
import { Payment } from 'lib/schemas'
import { formatDate, formatAmount } from 'lib/helpers'
import { useProjects } from 'lib/hooks/project'
import { useVendors } from 'lib/hooks/vendor'

interface Props {
  rows: Payment[]
  category: 'payments' | 'collections'
}

const accountMap: Record<number, string> = {
  1: 'ARS',
  2: 'USD',
}

function getTooltip(p: Payment): JSX.Element {
  return (
    <div>
      <p>Pago ID: {p.id}</p>
      <p><b>{formatAmount(p.amount)}</b> ({accountMap[p.accountId]})</p>
      <p>Proyecto ID: {p.projectId}</p>
      <p>Proveedor ID: {p.vendorId}</p>
      <p>Fecha completa: <em>{p.date}</em></p>
    </div>
  )
}

const TxTable = ({ rows, category }: Props): JSX.Element => {
  const projectsData = useProjects()
  const vendorsData = useVendors()

  const getProjectName = (id: number): string => {
    if (!projectsData.data?.projects) {
      return ''
    }
    const project = projectsData.data.projects.find(p => p.id === id)
    return project ? project.name : ''
  }

  const getVendorName = (id: number): string => {
    if (!vendorsData.data?.vendors) {
      return ''
    }
    const vendor = vendorsData.data.vendors.find(v => v.id === id)
    return vendor ? vendor.name : ''
  }

  const handleDelete = (id: number): void => {
    alert(`Delete payment with ID ${id}`)
  }

  return (
    <PaperContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Importe</TableCell>
            <TableCell align="center">Cuenta</TableCell>
            <TableCell>Proy.</TableCell>
            <TableCell>{category === 'payments' ? 'Prov.' : 'Cliente'}</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Tooltip key={row.id} title={getTooltip(row)} arrow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell align="right">{formatAmount(row.amount)}</TableCell>
                <TableCell align="center">{accountMap[row.accountId]}</TableCell>
                <TableCell>{getProjectName(row.projectId)}</TableCell>
                <TableCell>
                  {category === 'payments'
                    ? getVendorName(row.vendorId)
                    : 'getCustomerName(row.customerId)'
                  }
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon fontSize="inherit" color="secondary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </Tooltip>
          ))}
        </TableBody>
      </Table>
    </PaperContainer>
  )
}

export default TxTable
