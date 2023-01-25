import type { NextPage } from 'next'
import { Grid, Paper, SvgIcon, Tooltip, Typography } from '@mui/material'
import { OwnerList } from '@/components/settings/owner/OwnerList'
import { RequiredConfirmation } from '@/components/settings/RequiredConfirmations'
import useSafeInfo from '@/hooks/useSafeInfo'
import useIsGranted from '@/hooks/useIsGranted'

const Setup: NextPage = () => {
  const { safe } = useSafeInfo()
  const ownerLength = safe.owners.length
  const threshold = safe.threshold
  const isGranted = useIsGranted()

  return (
    <>
        <Paper sx={{ p: 4 }}>
          <OwnerList isGranted={isGranted} />
          <RequiredConfirmation threshold={threshold} owners={ownerLength} isGranted={isGranted} />
        </Paper>
    </>
  )
}

export default Setup
