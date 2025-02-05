import BadgeAvatar from '@/components/badge-avatar'
import Members from '@/components/common/Members'
import TransactionHistory from '@/components/common/TransactionHistory'
import TransactionQueue from '@/components/common/TransactionQueue'
import FolderList from '@/components/folder-list'
import ellipsisAddress from '@/utils/ellipsisAddress'
import { Receipt } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar'
import useWallet from '@/hooks/wallets/useWallet'
import { sendMessage } from '@/services/chat'
import AddFolder from '@/components/chat/addFolder'
import useConnectWallet from '@/components/common/ConnectWallet/useConnectWallet'
import TokenTransferModal from '@/components/tx/modals/TokenTransferModal'
import useSafeInfo from '@/hooks/useSafeInfo'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import css from './styles.module.css'
import useTxQueue from '@/hooks/useTxQueue'
import { toast } from 'react-toastify'
import useTxHistory from '@/hooks/useTxHistory'
import dynamic from 'next/dynamic'
import TxListItem from '@/components/transactions/TxListItem'
import FolderGroup from '@/components/folder-list/folderGroups'

const SendMessage = dynamic(() => import('@/components/chat/sendMessage'), {ssr: false})

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const drawerWidth = 340

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}))

const StyledAlert = styled(Alert)(() => ({
  backgroundColor: 'hsla(231, 17%, 76%, 0.33)',
}))

const chatHistory = [
  {
    name: 'Sero',
    transaction: false,
    timeAgo: '4d',
    message: `I'm trying to upload a profile image to my account but every time I try and upload the image nothing happens. I don't see any error messages but my profile image is still the same.Please can you take a look into this for me?`,
  },
  {
    name: 'You',
    transaction: false,
    timeAgo: '4d',
    message: `Hi Sero, sorry to hear that it's not working as expected. Please can you let me know what image format (JPEG, PNG, etc) you are trying to upload?`,
  },
  {
    transaction: true,
    author: 'Sero',
    transactionTitle: 'addOwnerWithThreshold',
    timeAgo: '4d',
  },
  {
    name: 'You',
    transaction: false,
    timeAgo: '4d',
    message: `Ahh yes, I've tried a JPEG and it's all working fine now. Thanks for your help!`,
  },
  {
    name: 'You',
    transaction: false,
    timeAgo: '4d',
    message: `Thank you Olen. Unfortunately we don't currently support the WebP image format. If you convert that to a JPEG and retry then it should work as expected.You should have received some feedback when you tried to upload it so I'll get someone to take a look into why this didn't happen. Thanks for getting in touch. Is there anything I can help you with?`,
  },
]

const summary = [
  { name: 'Kristen', message: 'Requests $50 from you 🤔' },
  { name: 'Magnus', message: 'Challenges you to play Chess for $5' },
  { name: 'Decentra', badge: true, message: 'You need to sign a tx ✏' },
]

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1.5 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

 const NewChat = () => {
  const [folders, setFolders] = useState([]);
  const [popup, togglePopup] = useState<boolean>(false);
  const [open, setOpen] = useState(true)
  const [value, setValue] = React.useState(0)
  const [mobileValue, setMobileValue] = React.useState(0)
  const wallet = useWallet()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([''])
  const connectWallet = useConnectWallet()
  const [chatData, setChatData] = useState<any[]>([''])
  const txHistory = useTxHistory()
  const txQueue = useTxQueue()
  const { safe, safeAddress } = useSafeInfo()
  const [ownerStatus, setOwnerStatus] = useState<boolean>()
  const [send, setSend] = useState(false);
  const owners = safe?.owners || ['']
  console.log('re-render')
  useEffect(() => {
    const activeFolders = async () =>{
      const items = JSON.parse(localStorage.getItem('folders')!);
     // const myArray = items.split(",");
      if (items) {
       setFolders(items);
      }
    }
    activeFolders()
    window.addEventListener('storage', activeFolders)
    return () => {  
      window.removeEventListener('storage', activeFolders)
    }
  }, []);

  useEffect(() => {
    let isOwnerArr: any[] = []
    if (owners && wallet?.address) {
      owners.map((owner) => {
        if (owner.value == wallet.address) {
          isOwnerArr.push(wallet.address)
        }
      })
      isOwnerArr.length > 0 ? setOwnerStatus(true) : setOwnerStatus(false)
    }
  }, [owners, wallet])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const handleMobileChange = (event: React.SyntheticEvent, newValue: number) => {
    setMobileValue(newValue)
  }
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setOpen(open)
  }

  useEffect(() => {
    let allData: any[] = []
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
      if (tx.type === 'LABEL') {
        return
      }
      allData.push({
        data: tx,
        timestamp: tx.transaction.timestamp,
        type: 'tx',
      })
    })
    ;
    if (!messages) {
      setChatData(allData)
      return;
    }
    messages?.forEach((message: any) => {
      allData.push({
        data: message,
        timestamp: +message.sentAt * 1000,
        type: 'message',
      })
    })
    allData.sort(function (a, b) {
      if (a['timestamp'] > b['timestamp']) {
        return 1
      } else if (a['timestamp'] < b['timestamp']) {
        return -1
      } else {
        return 0
      }
    })
    setChatData(allData);
  }, [messages, txHistory?.page?.results])

  return (
    <>
      {/*Pop up, TODO: fix this shit to use real styled stuff*/}
      {
        popup ? 
        <AddFolder />
        :
        ''
      }
      <Head>
        <title>Safe &mdash; Chat</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <Hidden mdDown>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                bgcolor: 'background.paper',
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton aria-label="add folder" onClick={() => togglePopup(!popup)}>
                <AddIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List sx={{ display: 'flex' }}>
              {summary.map((info, index) => (
                <Tooltip
                  title={
                    <Typography sx={{ width: 80 }} noWrap>
                      {info.message}
                    </Typography>
                  }
                  placement="top"
                  arrow
                  key={info.name}
                >
                  <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ListItemAvatar sx={{ minWidth: 35 }}>
                      {info.badge ? <BadgeAvatar name={info.name} /> : <Avatar alt={info.name} />}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: '14px' }} variant="body2" component="span">
                          {info.name}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Tooltip>
              ))}
            </List>
            <Box sx={{ width: '100%', height: '100%' }}>
              {/*@ts-ignore*/}
              <Tabs value={value} onChange={handleChange} aria-label="folder tabs">
                <Tab label="All" {...a11yProps(0)} />
                {
                  folders.map((folder, i) => {
                    return <Tab label={folder} key={`${folder}-${i}`}/>
                  })
                }
                {/* <Tab label="Ricochet-related" {...a11yProps(1)} />
                <Tab label="Company multisigs" {...a11yProps(2)} /> */}
              </Tabs>
              <TabPanel value={value} index={0}>
                <FolderList />
              </TabPanel>
              {
                folders.map((folder, i) => {
                  return (
                    <TabPanel value={value} index={i + 1}>
                      <FolderGroup group={folder}/>
                    </TabPanel>
                  )
                })
              }
              
            
            </Box>
            <Divider />
            <Box sx={{ width: '100%', display: 'flex', gap: '16px', pt: 2, px: 3 }}>
              { 
                wallet ? (
                  <>
                    <Avatar alt="Daniel from Decentra" />
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>From {ellipsisAddress(`${safeAddress}`)}</Typography>
                      <Typography sx={{ color: grey[600] }} paragraph>
                        {ellipsisAddress(`${wallet.address}`)}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Button onClick={connectWallet}>
                    <Typography sx={{ color: grey[600] }} paragraph>
                    Connect Wallet
                    </Typography>
                  </Button>
                )
               
              }
            
            </Box>
          </Drawer>
        </Hidden>
        <Main open={open} sx={{ flexGrow: 1, bgcolor: 'background.default' }} className={css.mainview}>
          <Toolbar
            sx={{
              display: 'flex',
              position: 'sticky',
              zIndex: '1000',
              top: 0,
              justifyContent: 'space-between',
              alignContent: 'center',
              bgcolor: 'background.default',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
              <Avatar alt="Decentra" />
              <Typography variant="h6" component="h6">
                Decentra
              </Typography>
            </Box>
            <Hidden mdDown>
              <IconButton onClick={toggleDrawer(!open)}>
                {open ? <CloseIcon aria-label="close sidebar" /> : <ViewSidebarIcon aria-label="show sidebar" />}
              </IconButton>
            </Hidden>
          </Toolbar>
          <Divider />
          <Hidden mdUp>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Tabs variant="fullWidth" value={mobileValue} onChange={handleMobileChange} aria-label="responsive tabs">
                <Tab label="Timeline" {...a11yProps(0)} />
                <Tab label="Overview" {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={mobileValue} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      flex: '1 0 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'start',
                      alignItems: 'start',
                      gap: '16px',
                    }}
                  >
                    <StyledAlert icon={false}>
                      <Typography paragraph>This is the beginning of the timeline from this Safe</Typography>
                      <Typography paragraph>
                        The timeline shows all your chat, transactions and events in one place. Only members of this
                        group can see the chat. Say hi!
                      </Typography>
                      <Typography sx={{ fontStyle: 'italic', fontSize: '12px' }} paragraph>
                        Safe created on 5 March 2023 at 19:34:53 CET
                      </Typography>
                    </StyledAlert>
                    <Typography sx={{ fontWeight: 500 }}>Thursday, 9 March 2023</Typography>
                    <List>
                      {chatHistory.map((chat, index) => {
                        if (chat.transaction) {
                          return (
                            <ListItem key={index} alignItems="flex-start">
                              <ListItemIcon>
                                <Receipt />
                              </ListItemIcon>
                              <ListItemText
                                disableTypography
                                sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                                primary={
                                  <React.Fragment>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: '10px',
                                      }}
                                    >
                                      <Typography sx={{ display: 'inline' }} component="span" variant="body2">
                                        Transaction proposed by {chat.author}
                                      </Typography>
                                      <Typography sx={{ display: 'inline' }} component="span" variant="body2">
                                        {chat.timeAgo}
                                      </Typography>
                                    </Box>
                                  </React.Fragment>
                                }
                                secondary={
                                  <React.Fragment>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: '10px',
                                        border: '1px solid #F1F2F5',
                                        borderRadius: '8px',
                                        p: 2,
                                      }}
                                    >
                                      <Avatar sx={{ width: 24, height: 24 }} alt={chat.transactionTitle} />
                                      <Typography sx={{ display: 'inline' }} variant="body2" component="span">
                                        {chat.transactionTitle}
                                      </Typography>
                                    </Box>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                          )
                        } else {
                          return (
                            <ListItem key={index} alignItems="flex-start">
                              <ListItemAvatar sx={{ minWidth: 35, pr: '10px' }}>
                                <Avatar sx={{ width: 32, height: 32 }} alt={chat.name} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <React.Fragment>
                                    <Typography
                                      sx={{ display: 'inline', pr: '8px', fontWeight: 600 }}
                                      component="span"
                                      variant="subtitle2"
                                    >
                                      {chat.name}
                                    </Typography>
                                    <Typography sx={{ display: 'inline' }} component="span" variant="body2">
                                      {chat.timeAgo}
                                    </Typography>
                                  </React.Fragment>
                                }
                                secondary={chat.message}
                              />
                            </ListItem>
                          )
                        }
                      })}
                    </List>
                  </Box>
                  <Box sx={{ flexShrink: 0, position: 'sticky', bottom: 0, bgcolor: 'background.default' }}>
                    <Divider />
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', py: 2, px: 1 }}>
                      <TextField sx={{ flexGrow: 1 }} label="Type Something" value={message} onChange={(e) => setMessage(e.target.value)}/>
                      <Button variant="contained">Send chat</Button>
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={mobileValue} index={1}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      flex: '1 0 auto',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '40px',
                        pt: 3,
                        px: 3,
                      }}
                    >
                      <Typography sx={{ color: grey[500] }}>Network</Typography>
                      <Typography>Ethereum</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '40px',
                        pt: 3,
                        px: 3,
                      }}
                    >
                      <Typography sx={{ color: grey[500] }} paragraph>
                        Address
                      </Typography>
                      <Typography paragraph noWrap>
                        {ellipsisAddress('eth:0xaf4752EF320400CdbC659CF24c4da11635cEDb3c')}
                      </Typography>
                    </Box>
                    <Divider />
                    <Members members={owners}/>
                    <Divider />
                    <TransactionQueue />
                    <Divider />
                    <TransactionHistory />
                    <Divider />
                    <Box sx={{ p: 3 }}>
                      <Typography sx={{ fontWeight: 500 }} paragraph>
                        Apps
                      </Typography>
                      <Typography paragraph>
                        In Plain you can show any information about the customer you want here without having to sync
                        anything. You can do this by building a very simple API endpoint that Plain will then query when
                        you load this page.
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flexShrink: 0, position: 'sticky', bottom: 0, bgcolor: 'background.default' }}>
                    <Button sx={{ mb: 2 }} variant="outlined" fullWidth>
                      Send Tokens
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Send NFTs
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            </Box>
          </Hidden>
          <Hidden mdDown>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  flex: '1 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignItems: 'start',
                  gap: '16px',
                  p: 3,
                  bgcolor: 'background.default',
                }}
              >
                <StyledAlert icon={false}>
                  <Typography paragraph>This is the beginning of the timeline from this Safe</Typography>
                  <Typography paragraph>
                    The timeline shows all your chat, transactions and events in one place. Only members of this group
                    can see the chat. Say hi!
                  </Typography>
                  <Typography sx={{ fontStyle: 'italic', fontSize: '12px' }} paragraph>
                    Safe created on 5 March 2023 at 19:34:53 CET
                  </Typography>
                </StyledAlert>
                <Typography sx={{ fontWeight: 500 }}>Thursday, 9 March 2023</Typography>
                <List>
                  {chatData && chatData.map((chat, index) => {
                    if (chat.type === 'message' && chat?.data?.sender) {
                      return (
                        <ListItem key={index} alignItems="flex-start">
                          <ListItemAvatar sx={{ minWidth: 35, pr: '10px' }}>
                            <Avatar sx={{ width: 32, height: 32 }} alt={chat?.data?.sender.uid || ''} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: 'inline', pr: '12px', fontWeight: 600 }}
                                  component="span"
                                  variant="subtitle2"
                                >
                                  {chat.data.sender.name === wallet?.address ? 'You' : chat?.data?.sender.uid}
                                </Typography>
                                <Typography sx={{ display: 'inline' }} component="span" variant="body2">
                                  {chat.timeStamp}
                                </Typography>
                              </React.Fragment>
                            }
                            secondary={chat.data.text}
                          />
                        </ListItem>
                      )
                    } else {
                      return (
                        <ListItem key={index} alignItems="flex-start">
                          <ListItemAvatar sx={{ minWidth: 35, pr: '10px' }}>
                            <Avatar sx={{ width: 32, height: 32 }} alt={chat.name} />
                          </ListItemAvatar>
                          <TxListItem key={`${index}-tx`} item={chat?.data} />
                          <ListItemText
                            primary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: 'inline', pr: '8px', fontWeight: 600 }}
                                  component="span"
                                  variant="subtitle2"
                                >
                                  {chat.name}
                                </Typography>
                                <Typography sx={{ display: 'inline' }} component="span" variant="body2">
                                  {chat.timeAgo}
                                </Typography>
                              </React.Fragment>
                            }
                            secondary={chat.message}
                          />
                        </ListItem>
                      )
                    }
                  })}
                  {!chatData ?  <ListItem>No Chat</ListItem> : ''}
                </List>
              </Box>
              <Box sx={{ flexShrink: 0, position: 'sticky', bottom: 0, bgcolor: 'background.default' }}>
                <Divider />
                <Box sx={{ width: '100%', display: 'flex', gap: '16px', p: 3 }}>
                  <TextField
                    sx={{ flexGrow: 1 }}
                    label="Type Something"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <SendMessage
                    message={message} safeAddress={safeAddress} setMessages={setMessages} setMessage={setMessage} prevState={messages}/>
                </Box>
              </Box>
            </Box>
          </Hidden>
        </Main>
        <Hidden mdDown>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                bgcolor: 'background.default',
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="right"
            open={open}
          >
            <Toolbar>
              <Typography sx={{ fontWeight: 500 }}>Overview</Typography>
            </Toolbar>
            <Divider />
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '40px', pt: 3, px: 3 }}
            >
              <Typography sx={{ color: grey[500] }}>Network</Typography>
              <Typography>
              {
                safe?.chainId === '137' ? 'Matic' :
                safe?.chainId === '1' ? 'Ethereum' :
                safe?.chainId === '10' ? 'Optimism' :
                safe?.chainId === '80001' ? 'Mumbai' :
                '' 
              }
              </Typography>
            </Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '40px', pt: 3, px: 3 }}
            >
              <Typography sx={{ color: grey[500] }} paragraph>
                Address
              </Typography>
              <Typography paragraph noWrap>
                {ellipsisAddress(`${safeAddress}`)}
              </Typography>
            </Box>
            <Divider />
            <Members members={owners}/>
            <Divider />
            <TransactionQueue />
            <Divider />
            <TransactionHistory />
            <Divider />
            <Box sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 500 }} paragraph>
                Apps
              </Typography>
              <Typography paragraph>
                In Plain you can show any information about the customer you want here without having to sync anything.
                You can do this by building a very simple API endpoint that Plain will then query when you load this
                page.
              </Typography>
              <Box sx={{ position: 'fixed', bottom: 0, bgcolor: 'background.default' }}>
                <Button sx={{ mb: 2 }} variant="outlined" fullWidth onClick={() => setSend(true)}>
                  Send Tokens
                </Button>
                <Button variant="outlined" fullWidth>
                  Send NFTs
                </Button>
              </Box>
            </Box>
          </Drawer>
        </Hidden>
        {
          send ?? <TokenTransferModal
            onClose={() => setSend(false)}
            initialData={[{ tokenAddress: '0xcaa7349cea390f89641fe306d93591f87595dc1f' }]}
          />
        }
      </Box>
    </>
  )
}

export default React.memo(NewChat)