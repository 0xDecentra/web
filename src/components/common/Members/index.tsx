import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { FC } from 'react'
import ellipsisAddress from '@/utils/ellipsisAddress'

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
        {members.map((member, index) => (
          <ListItem key={member.value}>
            <ListItemAvatar sx={{ minWidth: 35 }}>
              <Avatar sx={{ width: 24, height: 24 }} alt={member.value} />
            </ListItemAvatar>
            <ListItemText primary={ellipsisAddress(`${member.value}`)} />
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Members
