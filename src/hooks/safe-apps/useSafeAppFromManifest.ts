import { useEffect, useMemo } from 'react'
import { Errors, logError } from '@/services/exceptions'
import { fetchSafeAppFromManifest } from '@/services/safe-apps/manifest'
import useAsync from '../useAsync'
import type { SafeAppDataWithPermissions } from '@/components/safe-apps/types'
import { getEmptySafeApp } from '../../components/safe-apps/utils'

type UseSafeAppFromManifestReturnType = {
  safeApp?: SafeAppDataWithPermissions
  isLoading: boolean
}

//TODO
const useSafeAppFromManifest = (appUrl: string, chainId: string): UseSafeAppFromManifestReturnType => {
  const [data, error, isLoading] = useAsync<SafeAppDataWithPermissions>(() => {
    if (appUrl && chainId) return fetchSafeAppFromManifest(appUrl, chainId)
  }, [appUrl, chainId])

  const emptyApp = useMemo(() => getEmptySafeApp(appUrl), [appUrl])

  useEffect(() => {
    if (!error) return
    logError(Errors._903, `${appUrl}, ${(error as Error).message}`)
  }, [appUrl, error])

  return { safeApp: data || emptyApp, isLoading }
}

export { useSafeAppFromManifest }
