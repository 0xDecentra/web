import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { FC } from 'react'

interface TypeMembers {
  members: any[]
}

const Members: FC<TypeMembers> = ({members}) => {
  return (
    <>
      <Box sx={{ pt: 3, pl: 3 }}>
        <Typography sx={{ fontWeight: 500 }}>Members</Typography>
      </Box>
      <List sx={{ pl: 1 }}>
        {members.map((text, index) => (
          <ListItem key={text}>
            <ListItemAvatar sx={{ minWidth: 35 }}>
              <Avatar sx={{ width: 24, height: 24 }} alt={text} />
            </ListItemAvatar>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Members
