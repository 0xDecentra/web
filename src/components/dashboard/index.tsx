import type { ReactElement } from 'react'
import { Grid } from '@mui/material'
import { FeaturedApps } from '@/components/dashboard/FeaturedApps/FeaturedApps'
import CreationDialog from '@/components/dashboard/CreationDialog'
import { useRouter } from 'next/router'
import Owner from '@/components/dashboard/HomeSidebar/ownerlist'
import Home from '@/pages/chat/chat'

const Dashboard = (): ReactElement => {
  const router = useRouter()
  const { showCreationModal = '' } = router.query

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={8}>
          <Home />
        </Grid>

        <Grid item xs={4} className={css.rightdashboardsidebar}>
          <Owner />
          <FeaturedApps />
        </Grid>
      </Grid>
      {showCreationModal ? <CreationDialog /> : null}
    </>
  )
}

export default Dashboard
