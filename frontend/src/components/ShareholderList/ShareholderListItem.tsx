import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import { Shareholder } from 'lib/models'

interface Props {
  shareholder: Shareholder
}

const ShareholderListItem = ({ shareholder }: Props): JSX.Element => {
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
                {shareholder.name}
              </Typography>
            )}
          />
        </ListItem>
      </Paper>
    </Box>
  )
}

export default ShareholderListItem

