
import styles from '../styles/Home.module.css'
import LoginPage from '../components/LoginPage';
import DBoard from '../components/Dashboard'
import {useState} from 'react';

export default function Home() {

  const [openDashboard, setOpenDashboard] = useState(false);
  function allow() {
    setOpenDashboard(true);
  }

  return (
    <>
      {
        openDashboard ?
        <DBoard DB="Ultratech"></DBoard>
        :
        <div className={styles.container} >
          <LoginPage allow={allow}></LoginPage>
        </div>

      }
    </>
  )
}
