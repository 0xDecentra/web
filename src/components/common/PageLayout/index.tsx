import { useState, type ReactElement } from 'react'
import classnames from 'classnames'

import {
  Grid,
} from '@mui/material'

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
<Grid container spacing={3} p={3} pb={0} flex={1}>
   <Grid item className={css.sidebar}>
      <SideDrawer isOpen={isSidebarOpen} onToggle={setSidebarOpen} />
    </Grid>
    <Grid item flex={1}>
      <div className={classnames(css.main, !isSidebarOpen && css.mainNoSidebar)}>
        <div className={css.content}>
          <SafeLoadingError>{children}</SafeLoadingError>
        </div>
     </Grid>
 </Grid>
        <Footer />
      </div>
    </>
  )
}

export default PageLayout
