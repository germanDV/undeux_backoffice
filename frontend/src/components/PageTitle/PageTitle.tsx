import Typography from '@mui/material/Typography'

interface Props {
  children: string
}

const PageTitle = ({ children }: Props): JSX.Element => {
  return (
    <Typography variant="h4" align="center">
      {children.toUpperCase()}
    </Typography>
  );
};

export default PageTitle

