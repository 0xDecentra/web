import { toast } from 'react-toastify'
import useSafeAddress from '@/hooks/useSafeAddress'
import { joinGroup, createNewGroup, getGroup } from '../../services/chat'

//@ts-ignore
const Join: any = ({setGroup, user}) => {
  const safeAddress = useSafeAddress()

  const handleJoin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await joinGroup(`pid_${safeAddress}`)
          .then((user) => {
            console.log(user)
            resolve(user)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      }),
      {
        pending: 'Signing up...',
        success: 'Signned up successful 👌',
        error: 'Error, maybe you should login instead? 🤯',
      },
    )
    await handleGetGroup()
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
    await handleJoin()
    await handleGetGroup()
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
          .catch((error) => console.log(error))
      }),
      {
        pending: 'Creating...',
        success: 'Group created 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  return <>
  <button onClick={handleJoin}>Join</button>
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
}

export default Join
