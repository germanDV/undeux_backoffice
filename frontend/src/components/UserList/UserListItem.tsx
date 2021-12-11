import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import BlockIcon from '@mui/icons-material/Block'
import { User, Roles } from 'lib/schemas'
import UserActions from './UserActions'

interface Props {
  user: User
}

const UserListItem = ({ user }: Props): JSX.Element => {
  const isAdmin = user.role === Roles.admin
  const textStyle = user.active ? {} : { textDecoration: 'line-through' }

  return (
    <Box my={2}>
      <Paper elevation={3}>
        <ListItem secondaryAction={(
          <UserActions
            userId={user.id}
            email={user.email}
            isAdmin={isAdmin}
            active={user.active}
          />
        )}>
          <ListItemAvatar>
            <Avatar>
              {!user.active ? <BlockIcon /> : isAdmin ? <VerifiedUserIcon /> : <PersonIcon />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(
              <Typography variant="h6" sx={textStyle}>
                {user.id} {user.name}
              </Typography>
            )}
            secondary={(
              <Typography variant="subtitle2" sx={textStyle}>
                {user.email}
              </Typography>
            )}
          />
        </ListItem>
      </Paper>
    </Box>
  )
}

export default UserListItem
