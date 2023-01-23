import type { NextPage } from 'next'
import Head from 'next/head'

import AssetsHeader from '@/components/balances/AssetsHeader/index'

import Dashboard from '@/components/dashboard'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Safe – Dashboard</title>
      </Head>

      <main>
        <Dashboard />
        <AssetsHeader />
      </main>
    </>
  )
}

export default Home
