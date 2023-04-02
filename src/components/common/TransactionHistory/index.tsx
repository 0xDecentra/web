import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Typography } from '@mui/material'
import styles from './styles.module.css'

const TransactionHistory = () => {
  return (
    <Accordion className={styles.accordion} square disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: ({ palette }) => palette.primary.light }} />}
        aria-controls="transactions-content"
        id="transactions-content-header"
      >
        <Box sx={{ display: 'flex', gap: '5px' }}>
          <Typography sx={({ palette }) => ({ color: palette.primary.light, fontWeight: 500 })}>
            Transaction History
          </Typography>
          <Chip label="7" size="small" />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
          lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

export default TransactionHistory
