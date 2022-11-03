import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
// import LoginPage from './components/LoginPage'
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';
import {useState} from 'react';

export default function Home() {

  const [openDashboard, setOpenDashboard] = useState(false);

  function allow() {
    setOpenDashboard(true);
  }

  return (
    <>
      {
        // openDashboard ?
        <Dashboard></Dashboard>
        // :
        // <div className={styles.container} >
        //   <LoginPage allow={allow}></LoginPage>
        // </div>

      }
    </>
  )
}
