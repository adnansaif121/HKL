import React from 'react'
import DBoard from '../components/Dashboard'
import { useRouter } from "next/router";

export default function Dashboard() {
  const { query } = useRouter();

  return (
    <>
      <DBoard DB={query.db}></DBoard>
    </>
  )
}

