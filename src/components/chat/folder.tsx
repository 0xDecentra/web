import { useEffect, useState, type ReactElement } from 'react'
import Button from '@mui/material/Button'
import AddIcon from '@/public/images/common/add.svg'
import SafeListItem from '../sidebar/SafeListItem'
import SvgIcon from '@mui/material/SvgIcon'
import css from './styles.module.css'

//@ts-ignore
const Folder = ({group}): ReactElement => {

  const [safeAddress, setSafeAddress] = useState<string>('');
  const [safes, setSafes] = useState<string[]>(['']);

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
  }, []);

  const addSafeToFolder = async () => {
    const safes = JSON.parse(localStorage.getItem(group)!);
    if (safes) {
      localStorage.setItem(group, JSON.stringify([...safes, safeAddress]));
    } else {
      localStorage.setItem(group, JSON.stringify([safeAddress]));
    }
  }

  const handleSetSafeAddress = (address: string) => {
    setSafeAddress(address)
  }

  return (
    <div className={css.group}>
      <h3>{group}</h3>
      <div className={css.header}>
        <label>Add Safe</label>
        <input value={safeAddress} onChange={(e) => handleSetSafeAddress(e.target.value)} placeholder={'Safe address'}/>
        <Button
          disableElevation
          className={css.addbutton}
          size="small"
          variant="outlined"
          onClick={() => addSafeToFolder()}
          startIcon={<SvgIcon component={AddIcon} inheritViewBox fontSize="small" />}
        >
          Add
        </Button>
      </div>
      
      <>
        {
          safes.map((safe) => {
            return <SafeListItem
              key={safe}
              address={safe}
              chainId={'137'}
              closeDrawer={() => {}}
              shouldScrollToSafe={true}
            />
          })
        }
      </>
    </div>
  )
}

export default Folder
