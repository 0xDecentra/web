import { Box } from '@mui/material'
import type { ReactElement, ReactNode } from 'react'

import NavTabs from '@/components/common/NavTabs'
import PageHeader from '@/components/common/PageHeader'
import { chatactivityNavItems } from '@/components/sidebar/SidebarNavigation/config'

const ChatHeader = ({ children }: { children?: ReactNode }): ReactElement => {
  return (
    <PageHeader
      title="Assets"
      action={
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <NavTabs tabs={chatactivityNavItems} />
            {children}
          </Box>
        </>
      }
    />
  )
}

export default ChatHeader
