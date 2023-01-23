import type { NextPage } from 'next'
import Head from 'next/head'

import ChatHeader from '@/components/chatactivity/index'

import Dashboard from '@/components/dashboard'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Safe – Dashboard</title>
      </Head>

      <main>
        <Dashboard />
        <ChatHeader />
      </main>
    </>
  )
}

export default Home
