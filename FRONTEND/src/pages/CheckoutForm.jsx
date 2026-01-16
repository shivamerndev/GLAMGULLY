import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderSummary from "../components/OrderSummary";
import { CustomerDataContext } from "../context/CustomerContext";
import { MapPin, Plus } from "lucide-react";
import ProgresssLoader from "../utils/ProgressLoader"

const CheckoutForm = () => {
    const { getAddresses, addAddress, profile } = useContext(CustomerDataContext)
    const navigate = useNavigate()
    const { productId } = useParams()
    const [isOpen, setIsOpen] = useState(false);
    const [addressForm, setAddressForm] = useState({ fullName: "", street: "", city: "", state: "", phone: "", postalCode: "", country: "India", customerId: "", isDefault: false });
    const [addresses, setAddresses] = useState(null);
    const [showaddresses, setshowAddresses] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const toggleHandle = () => { setIsOpen(!isOpen) }
    const [clickedAddress, setclickedAddress] = useState('id aayega')
    const [states, setStates] = useState([]);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart"))
        if (profile) {
            if (cart?.length >= 0) {
                return navigate("/cart")
            }
            getAddresses().then(res => { setAddresses(res); }).catch(err => console.log(err.response.data))
        }
    }, [profile])

    useEffect(() => {
        if (addresses?.length) {
            const dft = addresses.filter(a => a.isDefault === true)
            setshowAddresses(dft);
            setclickedAddress(dft[0]?._id || addresses[0]._id)
        }
        if (addresses?.length === 0) {
            setShowAddressForm(true)
            setAddressForm({ ...addressForm, isDefault: true, customerId: profile._id })
        }
    }, [addresses])

    const handleAddressSubmit = (e) => {
        e.preventDefault()
        addAddress(addressForm).then(res => { setAddresses(prev => [...prev, res]); setShowAddressForm(false) }).catch(err => console.error(err.response.data))
    };
    useEffect(() => {
        fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
            headers: {
                'X-CSCAPI-KEY': "M2ZVMTFjMUlwZVRvQkdGeVF5YkxoM1NKbWdOa3hXWlFCSHE5NnRyYg=="
            }
        })
            .then(response => response.json())
            .then(states => {
                setStates(states);
            });

    }, [showAddressForm])

    return (profile ?
        <div className="md:flex w-full gap-4 px-2 justify-center  not-first:font-semibold text-gray-700 md:py-4 py-2">
            {clickedAddress !== "id aayega" && <h1 onClick={() => {
                navigate(`/checkout/order/${productId || "cart"}${location?.search}${location?.search ? "&" : "?"}address=${clickedAddress}`) // not effecient for filters and sort queries but its okay.
            }} className="text-amber-50 fixed  z-10 bottom-4 -translate-x-1/2 max-w-10/12 left-1/2 bg-gradient-to-tr to-amber-800 from-yellow-950  text-center cursor-pointer py-3 px-6 whitespace-nowrap rounded-full text-base font-bold ">Continue For Payment  <span className="animate-piano text-amber-300 ml-1">
                    <span>{">"}</span>
                    <span>{">"}</span>
                    <span>{">"}</span>
                </span></h1>}
            <section className="md:w-1/2 ">
                <OrderSummary toggleHandle={toggleHandle} isOpen={isOpen} />
            </section>
            <section className="md:w-1/2 md:mt-0 mt-4">


                {showAddressForm && <div className="bg-white  w-full backdrop-blur-sm border-2 border-amber-200 outline-none rounded-xl py-3 mb-3 px-6 shadow-lg">
                    <h3 onClick={() => setShowAddressForm(true)} className="text-xl font-bold text-amber-900 mb-4">
                        {'Add New Address'}
                    </h3>
                    <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-amber-800">Full Name</label>
                            <input required
                                type="text"
                                value={addressForm.fullName}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                                className="w-full px-4 py-2 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                placeholder="Enter Your Name" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-amber-800">Country</label>
                            <label className="flex items-center gap-2 text-amber-950 border-2 border-amber-200 px-4 py-2 rounded-xl">
                                <input required
                                    type="radio"
                                    name="country"
                                    value="india"
                                    checked={true}
                                    onChange={(e) =>
                                        setAddressForm((prev) => ({ ...prev, country: e.target.value }))
                                    }
                                    className="text-amber-600 focus:ring-amber-500 accent-amber-900" />
                                India (Default)
                            </label>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="block text-sm font-semibold text-amber-800">Street Address</label>
                            <input required type="text"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                                className="w-full px-4 py-2 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                placeholder="Enter complete street address" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-amber-800">City</label>
                            <input required
                                type="text"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                                className="w-full px-4 py-2 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                placeholder="Enter city name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-amber-800">Pincode</label>
                            <input required
                                type="text"
                                value={addressForm.postalCode}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                                className="w-full px-4 py-2 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                placeholder="Enter pincode" />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-amber-800">State</label>
                            <select required onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))} value={addressForm.state} className="w-full px-4 py-2 border-2 capitalize border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm">
                                <option disabled value='' >Select Your State</option>
                                {states && states.map(s => <option key={s.id} className=' text-amber-950' value={s.name}>{s.name} ({s.iso2})</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold text-amber-800">Phone No.</label>
                            <input required
                                minLength={10}
                                maxLength={10}
                                type="text"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-4 py-2 border-2 capitalize border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                placeholder="Enter Phone" />
                        </div>
                        <div className="md:col-span-2 flex space-x-4 pt-4">
                            <input type='submit'
                                className="bg-gradient-to-r from-orange-500 to-amber-600 cursor-pointer  hover:from-amber-500  text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
                                value={'Save Address'} />
                            {showaddresses && <button onClick={() => {
                                setShowAddressForm(false);

                            }} className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-gray-500/40 hover:scale-105">
                                Cancel
                            </button>}
                        </div>
                    </form>
                </div>}

                {showaddresses && <div className="space-y-4" >
                    {showaddresses.map((address) => (
                        <div onClick={() => setclickedAddress(address._id)} key={address._id} className="flex  gap-4 items-center">
                            <div className={`border-2 cursor-pointer ${address.isDefault ? "border-green-200 from-green-100/70 to-blue-100/70 " : "border-amber-100 from-amber-50/50 to-orange-50/50"} rounded-xl w-full py-4 md:p-5 px-2 bg-gradient-to-r  backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
                                <input className="accent-green-400 w-5 h-5 rounded-full" type="checkbox" checked={address._id === clickedAddress} readOnly name="address" />
                                <div className="flex justify-between items-start gap-2">
                                    <MapPin className=" w-6 h-6 mt-2 text-orange-600" />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 ">
                                            <h3 className="md:text-xl leading-none font-bold text-amber-900">{address.fullName}</h3>
                                            {address.isDefault && (
                                                <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-amber-700 font-medium mb-1">{address.street}</p>
                                        <p className="text-amber-600">{address.city} - {address.postalCode}</p>
                                    </div>

                                    <button
                                        onClick={() => navigate("/user/settings?address")}
                                        className="bg-gradient-to-bl from-amber-700/90 self-center to-amber-600/90 hover:from-amber-500 text-white py-1.5 cursor-pointer px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                        title="Edit address">
                                        Edit Address
                                    </button>


                                </div>
                            </div>
                        </div>
                    ))}

                </div>}
                <div className="flex items-center justify-between px-4">

                    { addresses?.length > 1 && showaddresses?.length === 1 && <h1 onClick={() => {
                        setshowAddresses(addresses)
                    }} className="text-amber-50 bg-gradient-to-tl to-amber-700 from-yellow-800 via-orange-700 inline px-3 cursor-pointer py-1.5 my-4 rounded-md text-sm font-semibold ">View All </h1>}
                    {!showAddressForm && <button
                        onClick={() => {
                            setShowAddressForm(true);
                            // setAddressForm({ fullName: "", street: "", city: "", state: "", phone: "", postalCode: "", country: "India", customerId: profiles._id });
                        }}
                        className="bg-gradient-to-tl from-amber-700 my-4 to-amber-800  text-white lg:px-4 px-2 lg:py-2 py-1.5 rounded-md font-semibold flex items-center space-x-1 md:space-x-2 transition-all duration-300  shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105">
                        <Plus className="w-5 h-5" />
                        <span className='text-sm leading-none truncate'>Add New Address
                        </span>
                    </button>}
                </div>

            </section>
        </div> : <ProgresssLoader />
    );
};

export default CheckoutForm;
