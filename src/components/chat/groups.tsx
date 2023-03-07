import { useEffect, useState, type ReactElement } from 'react'
import { useRouter } from 'next/router'
import Track from '@/components/common/Track'
import SafeListItem from '../sidebar/SafeListItem'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import Folder from './folder'
import AddIcon from '@/public/images/common/add.svg'
import css from './styles.module.css'
import useOwnedSafes from '@/hooks/useOwnedSafes'
import useSafeInfo from '@/hooks/useSafeInfo'
import { OVERVIEW_EVENTS } from '@/services/analytics'

const GroupList = (): ReactElement => {
  const router = useRouter()
  const [groups, setGroups] = useState<string[]>([]);
  const { safeAddress, safe } = useSafeInfo()
  const ownedSafes = useOwnedSafes()
  const [folderName, setFolderName] = useState<string | undefined>();

  useEffect(() => {
    const activeGroups = async () =>{
      const items = JSON.parse(localStorage.getItem('folders')!);
     // const myArray = items.split(",");
      if (items) {
       setGroups(items);
      }
    }
    activeGroups()
    window.addEventListener('storage', activeGroups)
    return () => {  
      window.removeEventListener('storage', activeGroups)
    }
  }, []);

  const createFolder = async () => {
    const folders = JSON.parse(localStorage.getItem('folders')!);
    localStorage.setItem('folders', JSON.stringify(folders ? [...folders, `${folderName!},`] : [folderName!]));
  }

  const nameFolder = (name: string) => {
    setFolderName(name)
  }

  return (
    <div className={css.container}>
       <div className={css.header}>
        <h3>
          My Folders
        </h3>
          <Track {...OVERVIEW_EVENTS.ADD_GROUP}>
            <div >
              <input type="text" value={folderName} onChange={(e) => nameFolder(e.target.value)}/>
              <Button
                disableElevation
                className={css.addbutton}
                size="small"
                variant="outlined"
                onClick={() =>  createFolder()}
                startIcon={<SvgIcon component={AddIcon} inheritViewBox fontSize="small" />}
              >
                Add
              </Button>
            </div>
          </Track>
      </div>
      <>
        {groups?.map((group: string) => {
          return <div><Folder group={group}/></div>
        })}
      </>
    </div>
  )
}

export default GroupList
