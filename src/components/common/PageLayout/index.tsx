import { useState, type ReactElement } from 'react'
import classnames from 'classnames'

import {
  Grid,
} from '@mui/material'
import SafeList from '@/components/sidebar/SafeList'

import Header from '@/components/common//Header'
import css from './styles.module.css'
import SafeLoadingError from '../SafeLoadingError'
import Footer from '../Footer'
import SideDrawer, { isNoSidebarRoute } from './SideDrawer'
import PsaBanner from '../PsaBanner'

const PageLayout = ({ pathname, children }: { pathname: string; children: ReactElement }): ReactElement => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(!isNoSidebarRoute(pathname))

  return (
    <>
      <header className={css.header}>
        <PsaBanner />
        <Header onMenuToggle={setSidebarOpen} />
      </header>
      
            <SideDrawer isOpen={isSidebarOpen} onToggle={setSidebarOpen} />

<Grid container spacing={3} p={3} pb={0} flex={1}>
   <Grid item xs={12} md={4} lg={3.5} maxWidth={{ md: 400 }} className={css.sidebar}>
            <SafeList />
      </Grid>
    <Grid item flex={1}>
      <div className={classnames(css.main, !isSidebarOpen && css.mainNoSidebar)}>
        <div className={css.content}>
          <SafeLoadingError>{children}</SafeLoadingError>
        </div>
                <Footer />
      </div>
     </Grid>
 </Grid>
    </>
  )
}

export default PageLayout
