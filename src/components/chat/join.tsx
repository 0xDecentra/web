import { toast } from 'react-toastify'
import useSafeAddress from '@/hooks/useSafeAddress'
import { joinGroup, createNewGroup, getGroup } from '../../services/chat'
import { Box, Button, Grid, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import NewChatIcon from '@/public/images/chat/chat.svg'
import LogoGreen from '@/public/images/logo-green.svg'
import css from './styles.module.css'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Container } from '@mui/system'
import { useEffect } from 'react'

//@ts-ignore
const Join = ({user, setGroup}) => {
  const safeAddress = useSafeAddress()

  useEffect(() => {
    //handleCreateGroup()
    //handleJoin()
    //handleGetGroup()
  }, [])

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
            console.log(error)
            return
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

  return (
    <Container fixed sx={{ height: '100vh', width: '100vw' }}>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs lg={4} order={{ xs: 2, sm: 1 }}>
            <Paper sx={{ padding: 4, height: 1, maxWidth: '400px' }} className={css.loginwindowelement}>
              <SvgIcon component={NewChatIcon} inheritViewBox sx={{ width: '42px', height: '42px' }} />
              <Typography variant="h3" fontWeight={700} mb={1} mt={3}>
                Chat with your safe members now
              </Typography>

              <Typography variant="body2" mb={3}>
                Online messaging and signing transactions made easy.
              </Typography>

              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                <Button variant="contained" onClick={handleGetGroup}>
                  Get Group
                </Button>
                {/* <Button variant="text" onClick={handleSignup}>
                  Sign up <ChevronRightIcon />
                </Button> */}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs order={{ xs: 1, sm: 2 }}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SvgIcon component={LogoGreen} inheritViewBox sx={{ width: '300px', height: '300px' }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
  
/*   <>
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
  </> */
}

export default Join
