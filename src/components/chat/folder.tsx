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

  window.addEventListener('storage', () => {
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
    localStorage.removeItem(group);
    window.dispatchEvent(new Event("storage"));
  } 

  return (
    <div className={css.group}>
      <h3>{group}</h3>
      <button onClick={() => deleteFolder()}>Delete Folder</button>
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
        <Button
          disableElevation
          className={css.addbutton}
          size="small"
          variant="outlined"
          onClick={() => deleteSafeFromFolder()}
          startIcon={<SvgIcon component={AddIcon} inheritViewBox fontSize="small" />}
        >
          Delete
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
