import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import css from './styles.module.css'
import Link from 'next/link'
import useOwnedSafes from '@/hooks/useOwnedSafes'
import useSafeInfo from '@/hooks/useSafeInfo'
import useWallet from '@/hooks/wallets/useWallet'
import GroupList from '@/components/chat/groups'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import useSafeAddress from '@/hooks/useSafeAddress'

const JoinNoSSR = dynamic(() => import('@/components/chat/join'), { ssr: false })

const CometChatLoginNoSSR = dynamic(() => import('@/components/chat/login'), { ssr: false })


const Home: NextPage = () => {
  const [url, setUrl] = useState<any>('matic:')
  const [currentUser, setCurrentUser] = useState<any>()
  const [group, setGroup] = useState<any>()
  const [messages, setMessages] = useState([''])
  const allOwnedSafes = useOwnedSafes()
  const { safe } = useSafeInfo()
  const safeAddress = useSafeAddress();
  const wallet = useWallet()
  
  useEffect(() => {
    if (!safe) return;
    const chain = safe.chainId
    switch (chain) {
      case '137':
        setUrl('matic:')
    }
  }, [safe])

  if (!currentUser) {
    return <CometChatLoginNoSSR setCurrentUser={setCurrentUser} setMessages={setMessages}/>
  }

  if (!group) {
    return <JoinNoSSR user={currentUser} setGroup={setGroup}/>
  }

  return (
    <>
      <Head>
        <title>Safe – Chat</title>
      </Head>

      <main className={css.mainchatwindow}>
        <Link href={`/${url}${safeAddress}/new-chat`}>Chat</Link>
      </main>
    </>
  )
}

export default Home
