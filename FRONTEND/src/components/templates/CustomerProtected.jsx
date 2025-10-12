import { useContext, useEffect, useState } from 'react'
import { CustomerDataContext } from '../../context/CustomerContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import ProgressLoader from '../../utils/ProgressLoader.jsx'

const CustomerProtected = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { getprofile } = useContext(CustomerDataContext)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        getprofile().then(res => {
            setProfile(res)
            setLoading(false)
        }).catch(err => {
            navigate("/user/login", { replace: true, state: location })
            setLoading(false)
            console.log("Not Authorized.")
        })
    }, [])

    useEffect(() => {
        if (location.pathname.endsWith("login") && profile) {
            setLoading(true)
            console.error('Already LoggedIn');
            navigate(-1)
        }
    }, [profile])

    if (loading) {
        return <ProgressLoader />
    }

    return <>{children}</>

}

export default CustomerProtected;