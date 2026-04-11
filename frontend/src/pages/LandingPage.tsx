import React from 'react'
import { LANDING_PAGE_ROUTE } from '../config'
import { Navigate } from 'react-router'

export default function LandingPage() {
    return <Navigate to={LANDING_PAGE_ROUTE}/>
}
