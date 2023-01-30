import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useTxHistory from '@/hooks/useTxHistory'
import useWallet from '@/hooks/wallets/useWallet'
import TxListItem from '../transactions/TxListItem'
import {
  getMessages,
  initCometChat,
  listenForMessage,
  sendMessage,
  createNewGroup,
  getGroup,
} from '../../services/chat'
import useTxQueue from '@/hooks/useTxQueue'
import useSafeInfo from '@/hooks/useSafeInfo'

//@ts-ignore
const Chat = ({ user }) => {
  const { safe, safeAddress } = useSafeInfo()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [chatData, setChatData] = useState<any[]>([])
  const [group, setGroup] = useState<any>()
  const wallet = useWallet()
  const txHistory = useTxHistory()
  const txQueue = useTxQueue()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!message) return
    await sendMessage(`pid_${safeAddress}`, message)
      .then(async (msg: any) => {
        //@ts-ignore
        setMessages((prevState) => [...prevState, msg])
        setMessage('')
        scrollToEnd()
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  useEffect(() => {
    initCometChat()
    async function getM() {
      await getMessages(`pid_${safeAddress!}`)
        .then((msgs) => {
          //@ts-ignore
          setMessages(msgs)
          scrollToEnd()
        })
        .catch((error) => console.log(error))

      await listenForMessage(`pid_${safeAddress!}`)
        .then((msg) => {
          //@ts-ignore
          setMessages((prevState) => [...prevState, msg])
          scrollToEnd()
        })
        .catch((error) => console.log(error))
    }
    getM()
  }, [group, wallet, user])

  useEffect(() => {
    if (messages.length == 0) {
      return
    }
    let allData: any[] = []
    messages.forEach((message: any) => {
      allData.push({
        data: message,
        timestamp: +message.sentAt * 1000,
        type: 'message',
      })
    })
    txHistory.page?.results.forEach((tx: any) => {
      if (tx.type === 'DATE_LABEL') {
        return
      }
      allData.push({
        data: tx,
        timestamp: tx.transaction.timestamp,
        type: 'tx',
      })
    })
    txQueue.page?.results.forEach((tx: any) => {
      if (tx.type === 'DATE_LABEL') {
        return
      }
      allData.push({
        data: tx,
        timestamp: tx.transaction.timestamp,
        type: 'tx',
      })
    })
    console.log(txQueue, txHistory, 'tx')
    allData.sort(function (a, b) {
      if (a['timestamp'] > b['timestamp']) {
        return 1
      } else if (a['timestamp'] < b['timestamp']) {
        return -1
      } else {
        return 0
      }
    })
    setChatData(allData)
  }, [messages])

  const scrollToEnd = () => {
    const elmnt = document.getElementById('messages-container')
    //@ts-ignore
    elmnt.scrollTop = elmnt.scrollHeight
  }

  const handleCreateGroup = async () => {
    if (!user) {
      toast.warning('You need to login or sign up first.')
      return
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await createNewGroup(`pid_${safeAddress}`, 'safe')
          .then((gp) => {
            setGroup(gp)
            resolve(gp)
          })
          .catch((error) => {
            reject(new Error(error))
            console.log(error)
          })
      }),
      {
        pending: 'Creating...',
        success: 'Group created 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  const handleGetGroup = async () => {
    if (!user) {
      toast.warning('You need to login or sign up first.')
      return
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await getGroup(`pid_${safeAddress}`)
          .then((gp) => {
            setGroup(gp)
            resolve(gp)
          })
          .catch((error) => reject(new Error(error)))
      }),
      {
        pending: 'Creating...',
        success: 'Group created 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  useEffect(() => {
    if (user) {
      handleGetGroup()
    }
  }, [user])

  return (
    <div>
      <h2>Safe Chat</h2>
      <h4>Join the Live Chat</h4>
      <div>
        <div id="messages-container">
          {chatData.map((item: any, i) =>
            item.type === 'message' ? (
              <Message
                isOwner={item.data.sender.name === wallet?.address}
                owner={item.data.sender.uid}
                msg={item.data.text}
                key={i}
                data={item.data}
                timeStamp={item.timeStamp}
              />
            ) : (
              <TxListItem key={i} item={item.data} />
            ),
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="Leave a Message"
            placeholder={!group?.hasJoined ? 'Join group first to chat...' : 'Leave a Message...'}
            disabled={!group?.hasJoined}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>

        {!group ? (
          <>
            <button
              type="button"
              className="shadow-sm shadow-black text-white
              bg-red-500 hover:bg-red-700 md:text-xs p-2.5
              rounded-sm cursor-pointer font-light"
              onClick={handleCreateGroup}
            >
              Create Group
            </button>
            <button onClick={handleGetGroup}>Get Group</button>
          </>
        ) : null}
      </div>
    </div>
  )
}

//@ts-ignore
const Message = ({ msg, owner, isOwner, data, timeStamp }) => (
  <div>
    <div
      onClick={() => {
        console.log(data)
      }}
    >
      <div>
        <span>{timeStamp}: </span>
        <span>{isOwner ? '@You' : owner}: </span>
        <span> {msg}</span>
      </div>
    </div>
  </div>
)

export default Chat
