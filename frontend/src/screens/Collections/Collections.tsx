import Grid from '@mui/material/Grid'
import PageTitle from 'components/PageTitle/PageTitle'
import CollectionCharts from 'components/Collection/CollectionCharts'
import CollectionsTable from 'components/Collection/CollectionsTable'
import CollectionForm from 'components/Collection/CollectionForm'

const Collections = (): JSX.Element => {
  return (
    <div>
      <PageTitle>cobranzas</PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CollectionCharts />
        </Grid>
        <Grid item sm={12} md={8}>
          <CollectionsTable />
        </Grid>
        <Grid item sm={12} md={4}>
          <CollectionForm />
        </Grid>
      </Grid>
    </div>
  )
}

export default Collections


