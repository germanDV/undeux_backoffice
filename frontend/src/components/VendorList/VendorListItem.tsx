import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import { Vendor } from 'lib/schemas'
import { chop } from 'lib/helpers'

interface Props {
  vendor: Vendor
}

const VendorListItem = ({ vendor }: Props): JSX.Element => {
  const theme = useTheme()

  return (
    <Box my={2}>
      <Paper elevation={3}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(
              <Typography variant="h6">
                {vendor.name}
              </Typography>
            )}
            secondary={(
              <Typography variant="subtitle1" style={{ color: theme.palette.text.secondary }}>
                {chop(vendor.notes)}
              </Typography>
            )}
          />
        </ListItem>
      </Paper>
    </Box>
  )
}

export default VendorListItem

