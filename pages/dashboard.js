import React from 'react'
import Dashboard from '../components/Dashboard'
import { useRouter } from "next/router";

export default function dashboard() {
  const { query } = useRouter();

  return (
    <>
      <Dashboard DB={query.db}></Dashboard>
    </>
  )
}

