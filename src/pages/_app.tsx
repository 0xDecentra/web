import CookieBanner from '@/components/common/CookieBanner'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import MetaTags from '@/components/common/MetaTags'
import Notifications from '@/components/common/Notifications'
import PageLayout from '@/components/common/PageLayout'
import { cgwDebugStorage } from '@/components/sidebar/DebugToggle'
import { GATEWAY_URL_PRODUCTION, GATEWAY_URL_STAGING, IS_PRODUCTION } from '@/config/constants'
import { useInitSafeCoreSDK } from '@/hooks/coreSDK/useInitSafeCoreSDK'
import useBeamer from '@/hooks/useBeamer'
import { useLightDarkTheme } from '@/hooks/useDarkMode'
import { useInitSession } from '@/hooks/useInitSession'
import useLoadableStores from '@/hooks/useLoadableStores'
import usePathRewrite from '@/hooks/usePathRewrite'
import useSafeNotifications from '@/hooks/useSafeNotifications'
import useTxNotifications from '@/hooks/useTxNotifications'
import useTxPendingStatuses from '@/hooks/useTxPendingStatuses'
import { useTxTracking } from '@/hooks/useTxTracking'
import { useInitWeb3 } from '@/hooks/wallets/useInitWeb3'
import { useInitOnboard } from '@/hooks/wallets/useOnboard'
import useGtm from '@/services/analytics/useGtm'
import useStorageMigration from '@/services/ls-migration'
import Sentry from '@/services/sentry'; // needs to be imported first
import { StoreHydrator } from '@/store'
import '@/styles/globals.css'
import createEmotionCache from '@/utils/createEmotionCache'
import { CacheProvider, type EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { setBaseUrl as setGatewayBaseUrl } from '@safe-global/safe-gateway-typescript-sdk'
import { type AppProps } from 'next/app'
import Head from 'next/head'
import type { ReactNode } from 'react'
import { type ReactElement } from 'react'

const GATEWAY_URL = IS_PRODUCTION || cgwDebugStorage.get() ? GATEWAY_URL_PRODUCTION : GATEWAY_URL_STAGING

const InitApp = (): null => {
  setGatewayBaseUrl(GATEWAY_URL)
  usePathRewrite()
  useStorageMigration()
  useGtm()
  useInitSession()
  useLoadableStores()
  useInitOnboard()
  useInitWeb3()
  useInitSafeCoreSDK()
  useTxNotifications()
  useSafeNotifications()
  useTxPendingStatuses()
  useTxTracking()
  useBeamer()

  return null
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export const AppProviders = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const theme = useLightDarkTheme()

  return (
    <ThemeProvider theme={theme}>
      <Sentry.ErrorBoundary showDialog fallback={ErrorBoundary}>
        {children}
      </Sentry.ErrorBoundary>
    </ThemeProvider>
  )
}

interface WebCoreAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const WebCoreApp = ({
  Component,
  pageProps,
  router,
  emotionCache = clientSideEmotionCache,
}: WebCoreAppProps): ReactElement => {
  return (
    <StoreHydrator>
      <Head>
        <title key="default-title">Safe</title>
        <MetaTags prefetchUrl={GATEWAY_URL} />
      </Head>

      <CacheProvider value={emotionCache}>
        <AppProviders>
          <CssBaseline />

          <InitApp />

          <PageLayout pathname={router.pathname}>
            <Component {...pageProps} />
          </PageLayout>

          <CookieBanner />

          <Notifications />
        </AppProviders>
      </CacheProvider>
    </StoreHydrator>
  )
}

export default WebCoreApp
