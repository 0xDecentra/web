import { ListItemButton, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Link from 'next/link'
import ListItemText from '@mui/material/ListItemText'
import { AppRoutes } from '@/config/routes'
import { useEffect, useState } from 'react'
import ellipsisAddress from '../../utils/ellipsisAddress'
import useOwnedSafes from '@/hooks/useOwnedSafes'
import useSafeAddress from '@/hooks/useSafeAddress'
import { useRouter } from 'next/router'
import BadgeAvatar from '../badge-avatar'

//TODO: fix link here
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
  const [safeAddress, setSafeAddress] = useState<string>('');
  const [safes, setSafes] = useState<string[]>(['']);

  window?.addEventListener('storage', () => {
    const items = JSON.parse(localStorage.getItem(group)!);
    // const myArray = items.split(",");
    if (items) {
      setSafes(items);
    }
  })

  useEffect(() => {
    const activeGroups = async () =>{
      const items = JSON.parse(localStorage.getItem(group)!);
     // const myArray = items.split(",");
      if (items) {
       setSafes(items);
      }
    }
    activeGroups()
    window.addEventListener('storage', activeGroups)
    return () => {  
      window.removeEventListener('storage', activeGroups)
    }
  }, [localStorage.getItem(group)]);

  const addSafeToFolder = async () => {
    const safes = JSON.parse(localStorage.getItem(group)!);
    if (safes) {
      localStorage.setItem(group, JSON.stringify([...safes, safeAddress]));
    } else {
      localStorage.setItem(group, JSON.stringify([safeAddress]));
    }
    window.dispatchEvent(new Event("storage"));
  }

  const deleteSafeFromFolder = async () => {
    const safes = JSON.parse(localStorage.getItem(group)!);
    const updated = safes.filter((address: string) => address !== safeAddress)
    if (updated) {
      localStorage.setItem(group, JSON.stringify(updated));
    } else {
      localStorage.setItem(group, JSON.stringify([safeAddress]));
    }
    window.dispatchEvent(new Event("storage"));
  }

  const handleSetSafeAddress = (address: string) => {
    setSafeAddress(address)
  }

  const deleteFolder = async () => {
    console.log(group)
    await localStorage.removeItem(group);
    window.dispatchEvent(new Event("storage"));
  } 

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
    console.log(folder, history)
    setSelectedIndex(index)
    history.push(`${folder}/new-chat`)
  }
  //TODO
  return (
    <List>
      {safeFolder.map((folder, index) => (
        <Link
        href={{
          pathname: AppRoutes.chat,
          query: folder,
        }}
        key={`${folder}-${index}`}
        passHref>
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
        </Link>
      ))}
    </List>
  )
}
