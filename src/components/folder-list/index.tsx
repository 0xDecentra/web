import { ListItemButton, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { grey } from '@mui/material/colors'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import { useState } from 'react'
import ellipsisAddress from '../../utils/ellipsisAddress'
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
  const [selectedIndex, setSelectedIndex] = useState(1)

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedIndex(index)
  }
  return (
    <List>
      {folders.map((folder, index) => (
        <ListItemButton
          sx={{ borderRadius: '6px' }}
          key={folder.name}
          selected={selectedIndex === index}
          onClick={(event) => handleListItemClick(event, index)}
        >
          <ListItemAvatar>
            {folder.badge ? <BadgeAvatar name={folder.name} /> : <Avatar alt={folder.name} />}
          </ListItemAvatar>
          <ListItemText
            primary={<Typography sx={{ fontWeight: 500 }}>{folder.name}</Typography>}
            secondary={<Typography sx={{ color: grey[600] }}>{ellipsisAddress(folder.address)}</Typography>}
          />
        </ListItemButton>
      ))}
    </List>
  )
}
