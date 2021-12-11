import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import AppsIcon from '@mui/icons-material/Apps'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PieChartIcon from '@mui/icons-material/PieChart';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { Drawer, DrawerHeader } from './Sidebar.styles'
import SidebarItem from './SidebarItem'

interface Props {
  open: boolean
  drawerWidth: number
  handleClose: () => void
}

const Sidebar = ({ open, handleClose, drawerWidth }: Props): JSX.Element => {
  return (
    <Drawer variant="permanent" open={open} drawerWidth={drawerWidth}>
      <DrawerHeader>
        <IconButton onClick={handleClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List component="nav">
        <SidebarItem icon={<AppsIcon />} text="Inicio" to="/" />
        <SidebarItem icon={<AirlineSeatFlatIcon />} text="Clientes" to="/customers" />
        <SidebarItem icon={<DirectionsBikeIcon />} text="Proveedores" to="/vendors" />
        <SidebarItem icon={<PieChartIcon />} text="Socios" to="/shareholders" adminOnly />
        <SidebarItem icon={<PeopleAltIcon />} text="Usuarios" to="/users" adminOnly />
        <SidebarItem icon={<HomeWorkIcon />} text="Proyectos" to="/projects" />
      </List>
    </Drawer>
  )
}

export default Sidebar

