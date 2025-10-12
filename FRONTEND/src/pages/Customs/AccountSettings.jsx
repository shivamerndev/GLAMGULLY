import { useContext, useEffect, useState } from 'react';
import { User, MapPin, Shield, Plus, Edit2, Trash2, Settings, MenuIcon, EyeOff, Eye } from 'lucide-react';
import { MdCancel } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import ProgressLoader from '../../utils/ProgressLoader';
import { CustomerDataContext } from '../../context/CustomerContext';
import { toast, ToastContainer } from 'react-toastify'
const AccountSettings = () => {
    const { updateProfile, getAddresses, addAddress, editAddress, deleteAddress, updatePassword, profile } = useContext(CustomerDataContext)
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("profile");
    const [activeNav, setActiveNav] = useState(false);
    const [isDefault, setDefault] = useState(false)
    const [confirm, setConfirm] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const tabs = [
        { id: 'profile', label: 'Update Your Profile', icon: User },
        { id: 'address', label: 'Address Management', icon: MapPin },
        { id: 'security', label: 'Change Your Password', icon: Shield }
    ];
    // Address state
    const [addresses, setAddresses] = useState(null);
    useEffect(() => {
        if (searchParams.size > 0) {
            setActiveTab(...searchParams.keys())
        }
        if ([...searchParams.keys()][0] === 'address') {
            getAddresses().then(res => { setAddresses(res); }).catch(err => console.log(err.response.data))
        }
    }, [searchParams, isDefault])

    // Profile state
    const [profiles, setProfile] = useState(null);
    const [changed, setChanged] = useState(null);
    useEffect(() => {
        if (profile) setProfile({
            fullname: profile.fullname,
            email: profile.email,
            phone: profile.phone,
            gender: profile.gender
        })
    }, [profile])
    const handleProfileChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setChanged(prev => ({ ...prev, [field]: value }));
    };
    const handleProfileSave = () => {
        if (changed) {
            updateProfile(changed)
        }
    };

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState(null);

    const handleAddressSubmit = (e) => {
        e.preventDefault()
        if (editingAddress) {
            editAddress(addressForm, addressForm._id).then(() => setShowAddressForm(false))
        } else {
            addAddress(addressForm).then(res => { setAddresses(prev => [...prev, res]); setShowAddressForm(false) }).catch(err => console.error(err.response.data))
        }
    };
    const handleEditAddress = (address) => {
        setEditingAddress(true);
        setAddressForm(address)
        setShowAddressForm(true);
    };
    const handleDeleteAddress = (id) => {
        deleteAddress(id).then(res => setDefault(res.message))
    };
    const handleSetDefault = (id) => {
        let obj = { isDefault: true }
        editAddress(obj, id).then(res => setDefault(!isDefault)).catch(err => console.log(err.response.data))
    };


    // Security state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: ''
    });
    // Security handlers
    const handlePasswordChange = (field, value) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordSubmit = () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !confirm) {
            alert('Please fill in all password fields');
            return;
        }
        updatePassword(passwordForm).then(res => { toast.success(res.message); setPasswordForm(false) }).catch(err => { toast.error(err.response.data.message); })
    };
    return (profiles ?
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex  items-start  justify-center">
            <ToastContainer />
            <div className="max-w-7xl mx-auto px-4 pt-6">

                {/* Header */}
                <div className="mb-4 flex justify-between lg:block lg:bg-transparent bg-orange-100 p-2 items-center rounded-xl">
                    <div className="flex items-center space-x-2 md:space-x-3  lg:mb-4">
                        <div className="p-2 md:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                            <Settings className="md:w-6 md:h-6 w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="md:text-2xl text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Account Settings
                            </h1>
                            <p className="text-amber-700/70 hidden lg:block  text-base">Manage your profile, addresses, and security preferences</p>
                        </div>
                    </div>
                    <div className='lg:hidden'>
                        {!activeNav && <MenuIcon onClick={() => setActiveNav(true)} className='text-amber-500  cursor-pointer' />}
                        {activeNav && <MdCancel onClick={() => setActiveNav(false)} className='text-3xl text-amber-500 cursor-pointer' />}
                    </div>
                </div>
                <div className="grid lg:grid-cols-4 md:gap-6 w-full relative">

                    {/* Sidebar Navigation */}
                    <div className={`lg:col-span-1 -top-4    right-0 z-10  ${activeNav ? "absolute lg:static" : "hidden lg:block "} `}>
                        <div className="lg:bg-white/80 bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-4 sticky top-8">

                            <nav className="space-y-3">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (<button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveNav(false);
                                            setSearchParams({ [tab.id]: tab.label }, { replace: true });
                                        }}
                                        className={`w-full flex cursor-pointer items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 transform scale-[1.02]'
                                            : 'text-amber-800 hover:bg-amber-50 hover:shadow-md hover:scale-[1.01]'
                                            }`}>
                                        <Icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                                            }`} />
                                        <span className="font-semibold text-sm leading-none">{tab.label}</span>
                                    </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>


                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl px-4 md:px-8 pt-5 pb-4">
                            {/* Profile Information Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <User className="w-7 h-7 text-amber-600" />
                                        <h2 className="text-2xl font-bold text-amber-900">Update Your Profile</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-amber-800">Full Name</label>
                                            <input
                                                type="text"
                                                value={profiles.fullname}
                                                onChange={(e) => handleProfileChange('fullname', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-amber-800">Email Address</label>
                                            <input
                                                type="email"
                                                value={profiles.email}
                                                onChange={(e) => handleProfileChange('email', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-amber-800">Phone Number</label>
                                            <input
                                                minLength={10}
                                                type="tel"
                                                value={profiles.phone}
                                                onChange={(e) => handleProfileChange('phone', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-amber-800">Gender</label>
                                            <select
                                                value={profiles.gender}
                                                onChange={(e) => handleProfileChange('gender', e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm">
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Prefer not to say</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-amber-200 outline-none">
                                        <button
                                            onClick={handleProfileSave}
                                            className="bg-gradient-to-r from-orange-500 to-amber-600 cursor-pointer  hover:from-amber-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-amber-500/40 hover:scale-105">
                                            Save Profile Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Address Management Tab */}
                            {activeTab === 'address' && addresses && (
                                <div className="space-y-8 ">
                                    <div className="flex justify-between gap-4 items-center">
                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                            <MapPin className="md:w-7 w-6 md:h-7 h-6 text-amber-600" />
                                            <h2 className="lg:text-2xl md:text-xl  text-sm font-bold leading-none text-amber-900">Address Management</h2>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowAddressForm(true);
                                                setEditingAddress(null);
                                                setAddressForm({ fullName: "", street: "", city: "", state: "", phone: "", postalCode: "", country: "India", customerId: profiles._id });
                                            }}
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white lg:px-6 px-3 lg:py-3 py-2 rounded-xl font-semibold flex items-center space-x-1 md:space-x-2 transition-all duration-300  shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105">
                                            <Plus className="w-5 h-5" />
                                            <span className='text-sm leading-none truncate'>Add New
                                                <span className='text-sm hidden md:inline '> Address</span>
                                            </span>
                                        </button>
                                    </div>

                                    {/* Address List */}
                                    <div className="space-y-4">
                                        {addresses.map((address) => (
                                            <div onClick={(e) => {
                                                let paths = ["BUTTON", "SVG", "PATH"]
                                                if (paths.includes(e.target.tagName.toUpperCase())) return;
                                                handleSetDefault(address._id)
                                            }} key={address._id} className={`border-2 cursor-pointer ${address.isDefault ? "border-green-200 from-green-100/70 to-blue-100/70 " : "border-amber-100 from-amber-50/50 to-orange-50/50"} rounded-xl py-4 md:p-6 px-2 bg-gradient-to-r  backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-xl font-bold text-amber-900">{address.fullName}</h3>
                                                            {address.isDefault && (
                                                                <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-amber-700 font-medium mb-1">{address.street}</p>
                                                        <p className="text-amber-600">{address.city} - {address.postalCode}</p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditAddress(address)}
                                                            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-yellow-500 text-white p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                                            title="Edit address">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAddress(address._id)}
                                                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-red-500 text-white p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                                            title="Delete address">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Address Form */}
                                    {showAddressForm && (
                                        <div className="bg-white absolute top-0 left-0 w-full backdrop-blur-sm border-2 border-amber-200 outline-none rounded-xl p-6 shadow-lg">
                                            <h3 className="text-xl font-bold text-amber-900 mb-6">
                                                {editingAddress ? 'Edit Address' : 'Add New Address'}
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
                                                                setAddressForm((prev) => ({ ...prev, label: e.target.value }))
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
                                                    <input required
                                                        type="text"
                                                        value={addressForm.state}
                                                        onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                                                        className="w-full px-4 py-2 border-2 capitalize border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                        placeholder="Enter State" />
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
                                                        value={editingAddress ? 'Update Address' : 'Save Address'} />
                                                    <button onClick={() => {
                                                        setShowAddressForm(false);
                                                        setEditingAddress(null);
                                                    }} className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-gray-500/40 hover:scale-105">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-4">

                                    <div className="flex items-center space-x-3">
                                        <Shield className="w-7 h-7 text-amber-600" />
                                        <h2 className="text-xl font-bold text-amber-900">Change Your Password</h2>
                                    </div>

                                    <div className="bg-white/70 backdrop-blur-sm rounded-xl px-5 pb-4 pt-2 shadow-lg">
                                        <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-gradient-to-r from-blue-800/80 to-orange-800/80 bg-clip-text text-transparen">

                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-amber-800" htmlFor="currentPassword">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        minLength={8}
                                                        type={showPassword ? "text" : "password"}
                                                        id="currentPassword"
                                                        value={passwordForm.currentPassword}
                                                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                        placeholder="Enter current password" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-amber-800" htmlFor="newPassword">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        minLength={8}
                                                        type={showPassword ? "text" : "password"}
                                                        id="newPassword"
                                                        value={passwordForm.newPassword}
                                                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                        className="w-full px-4 py-3 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                        placeholder="Enter New password" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors">
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-amber-800">Confirm Password</label>
                                                <div className="relative">
                                                    <input
                                                        required
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        onChange={(e) => setConfirm(e.target.value)}
                                                        value={confirm}
                                                        className={`w-full px-4 py-3 border-2 border-amber-200 outline-none rounded-xl focus:ring-2 focus:ring-amber-500  transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                                    placeholder="Enter current password ${confirm && passwordForm.newPassword !== confirm
                                                                ? 'border-red-300 focus:ring-red-400 text-amber-950'
                                                                : 'border-amber-300 text-amber-950  focus:ring-amber-400'
                                                            }`}
                                                        placeholder="Confirm New password" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors">
                                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                                {confirm && passwordForm.newPassword !== confirm && (
                                                    <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
                                                )}
                                            </div>


                                            <button
                                                type="submit"
                                                className="w-full cursor-pointer bg-gradient-to-r from-amber-500 to-rose-500 text-white py-3 mt-2 rounded-full hover:from-amber-600 hover:to-rose-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                                Update Password
                                            </button>
                                        </form>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div> : <ProgressLoader />
    );
};

export default AccountSettings;