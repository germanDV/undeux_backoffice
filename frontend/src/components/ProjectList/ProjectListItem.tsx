import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import FolderIcon from '@mui/icons-material/Folder'
import { Project } from 'lib/schemas'
import { chop } from 'lib/helpers'
import ProjectActions from './ProjectActions'

interface Props {
  project: Project
}

const ProjectListItem = ({ project }: Props): JSX.Element => {
  const theme = useTheme()

  return (
    <Box my={2}>
      <Paper elevation={3}>
        <ListItem secondaryAction={(
          <ProjectActions projectId={project.id} finished={project.finished} />
        )}>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={(
              <Typography variant="h6">
                {project.name}
              </Typography>
            )}
            secondary={(
              <Typography variant="subtitle1" style={{ color: theme.palette.text.secondary }}>
                {chop(project.notes)}
              </Typography>
            )}
          />
        </ListItem>
      </Paper>
    </Box>
  )
}

export default ProjectListItem

