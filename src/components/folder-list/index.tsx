import { ListItemButton, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { grey } from '@mui/material/colors'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useEffect, useState } from 'react'
import ellipsisAddress from '../../utils/ellipsisAddress'
import useOwnedSafes from '@/hooks/useOwnedSafes'
import useSafeAddress from '@/hooks/useSafeAddress'
import { useRouter } from 'next/router'
import BadgeAvatar from '../badge-avatar'

const folders = [
  {
    name: 'Company Treasury',
    address: 'eth:0xaf4752EF320400CdbC659CF24c4da11635cEDb3c',
  },
  {
    name: 'Decentra',
    badge: true,
    address: 'eth:0xaf4752EF320400CdbC659CF24c4da11635cEDb3c',
  },
  {
    name: 'Sero',
    address: 'eth:0xaf4752EF320400CdbC659CF24c4da11635cEDb3c',
  },
  {
    name: 'Company Admin',
    address: 'eth:0xaf4752EF320400CdbC659CF24c4da11635cEDb3c',
  },
  {
    name: 'Company HR',
    address: 'eth:0xaf4752EF320400CdbC659CF24c4da11635cEDb3c',
  },
]

export default function FolderList() {
  const ownedSafes = useOwnedSafes()
  const history = useRouter();
  const [safeFolder, setSafeFolder] = useState(['']);
  const [selectedIndex, setSelectedIndex] = useState(1)
  const safeAddress = useSafeAddress()

 useEffect(() => {
    if (ownedSafes) {

      let folderList: any[] = []
      const polygonSafes = ownedSafes[137];
      const optimismSafes = ownedSafes[5];
      const ethSafes = ownedSafes[1];
      if (polygonSafes) {
        polygonSafes.forEach(safe => folderList.push(`matic:${safe}`))
      }
      if (optimismSafes) {
        optimismSafes.forEach(safe => folderList.push(`optimism:${safe}`))
      }
      if (ethSafes) {
        ethSafes.forEach(safe => folderList.push(`eth:${safe}`))
      }
      if (!folderList) {
        return;
      }
      setSafeFolder(folderList);
    }
  }, [ownedSafes])
  
  const handleListItemClick = (folder:string, index: number) => {
    setSelectedIndex(index)
    history.push(folder)
  }
  //TODO
  return (
    <List>
      {safeFolder.map((folder, index) => (
        <ListItemButton
          sx={{ borderRadius: '6px' }}
          //key={folder.name}
          key={folder}
          selected={selectedIndex === index}
          onClick={() => handleListItemClick(folder, index)}
        >
          {/* <ListItemAvatar>
            {folder.badge ? <BadgeAvatar name={folder.name} /> : <Avatar alt={folder.name} />}
          </ListItemAvatar> */}
          <ListItemAvatar>
            <Avatar alt={folder} />
          </ListItemAvatar>
          <ListItemText
            primary={<Typography sx={{ fontWeight: 500 }}>{ellipsisAddress(folder)}</Typography>}
            //secondary={<Typography sx={{ color: grey[600] }}>{ellipsisAddress(folder.address)}</Typography>}
          />
        </ListItemButton>
      ))}
    </List>
  )
}
