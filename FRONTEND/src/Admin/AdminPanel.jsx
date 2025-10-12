import { useContext, useEffect, useState } from 'react'
import { ProductDataContext } from "../context/ProductContext";
import FormProduct from './FormProduct';
import Loader from '../../src/assets/loader.gif';
import { useNavigate } from 'react-router-dom';
import { getOrRenewToken, onForegroundMessage } from '../firebase.js';
import axios from 'axios';
import { FaShoppingBag, FaUsers, FaBoxOpen, FaRupeeSign } from "react-icons/fa";
import { AdminDataContext } from '../context/AdminContext.jsx';


const AdminPanel = () => {
  const { createReviewImg } = useContext(AdminDataContext)
  const [customer, setCustomer] = useState([{ fullname: "shivam verma", phone: 9955422156 }, { fullname: "Riya kumari", phone: 6512245599 }])
  const { getProductsAdmin, categoryProduct, categoryPublic, archiveCategory, activeCategory } = useContext(ProductDataContext)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [isActiveState, setIsActiveState] = useState({})
  const [category, setcategory] = useState(null)
  const [categoryp, setcategoryp] = useState(null)
  const [archive, setArchive] = useState({})

  useEffect(() => {
    const setupNotifications = async () => {
      const token = await getOrRenewToken();
      if (token) {
        axios.post(`${import.meta.env.VITE_BASE_URL}/api/subscribe`, { token });
      }
    };
    setupNotifications();
    onForegroundMessage();
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      setShowModal(false);
    }
  };

  useEffect(() => {
    getProductsAdmin().then((data) => {
      setProducts(data);
    })
    return () => {
      setProducts([])
    }
  }, [showModal]);

  useEffect(() => {
    categoryProduct().then(res => {
      setcategory(res)
    }).catch(err => {
      console.log(err);
    })

  }, [])

  useEffect(() => {
    categoryPublic().then(res => {
      setcategoryp(res)
    }).catch(err => {
      console.log(err);
    })

  }, [])

  useEffect(() => {
    if (categoryp) {
      const archiveObj = {};
      categoryp.forEach(c => {
        archiveObj[c.name] = true;
      });
      setArchive(archiveObj);
    }
  }, [categoryp]);


  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // File select handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file)
      setImage(URL.createObjectURL(file)); // preview banane ke liye blob url
    }
  };

  // Drag drop handle for laptop/desktop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file)
      setImage(URL.createObjectURL(file));
    }
  };


  return (products ?
    <div className="flex flex-col pt-19  lg:flex-row h-screen bg-gray-100">
      {/* Main content */}
      <main className="flex-1  pt-15 md:p-8 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl  font-semibold px-4 mb-2">Dashboard</h1>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-4">
          {/* Total Sales */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-5 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm opacity-80 mb-2">Total Sales</p>
            <div className="flex items-center space-x-1">
              <FaRupeeSign size={25} />
              <p className="text-2xl font-bold">{"3533"}</p>
            </div>
          </div>

          {/* Total Orders */}
          <div onClick={() => navigate('/admin/glamgully/orders')} className="bg-gradient-to-r from-blue-400 to-blue-600 p-5 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm opacity-80 mb-2">Total Orders</p>
            <div className="flex items-center space-x-3">
              <FaShoppingBag size={30} />
              <p className="text-2xl font-bold">{"453"}</p>
            </div>
          </div>

          {/* Total Customers */}
          <div onClick={() => navigate('/admin/glamgully/customers')} className="bg-gradient-to-r from-purple-400 to-purple-600 p-5 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm opacity-80 mb-2">Total Customers</p>
            <div className="flex items-center space-x-3">
              <FaUsers size={30} />
              <p className="text-2xl font-bold">{customer?.length || 0}</p>
            </div>
          </div>

          {/* Total Products */}
          <div onClick={() => navigate('/admin/glamgully/products')} className="bg-gradient-to-r from-pink-400 to-pink-600 p-5 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm opacity-80 mb-2">Total Products</p>
            <div className="flex items-center space-x-3">
              <FaBoxOpen size={30} />
              <p className="text-2xl font-bold">{products?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Product Management */}
        <section className="mb-8 px-2">
          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-2 mb-4">
            <h2 className="text-xl md:text-2xl text-center font-semibold">Product Management</h2>
            <button onClick={() => setShowModal(true)} className="bg-sky-500  cursor-pointer text-white px-3 py-2 rounded hover:bg-blue-700">Add New Product</button>
          </div>
          {showModal && <FormProduct EditProduct={showModal} setShowModal={setShowModal} handleBackdropClick={handleBackdropClick} />}
          <div className="overflow-auto bg-white shadow-lg rounded-xl">
            <table className="min-w-full text-center border-collapse">
              <thead className="bg-zinc-800 text-white text-sm uppercase tracking-wide">
                <tr>
                  <th className="px-1 py-3">Products</th>
                  <th className="px-1 py-3">Qty</th>
                  <th className="px-1 py-3">Price</th>
                  <th className="px-1 py-3">Status</th>
                  <th className="px-1 py-3">Edit</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products?.slice(0, 5).map((p, i) => (
                  <tr
                    key={i}
                    className={`
            border-b hover:bg-gray-100 transition-colors
            ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}
            ${p.quantity <= 5 ? "bg-red-50" : ""}
          `}>
                    <td className="px-2 py-3 font-medium text-gray-700">{p.title}</td>
                    <td
                      className={`px-2 py-3 font-semibold ${p.quantity <= 5 ? "text-red-600" : "text-gray-600"
                        }`}>
                      {p.quantity < 10 ? `0${p.quantity}` : p.quantity}
                    </td>
                    <td className="px-2 py-3 text-gray-700">₹{p.price}.00</td>
                    <td

                      className="px-2 py-3 cursor-pointer">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${(isActiveState[p._id] ?? p.isActive)
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}>
                        {(isActiveState[p._id] ?? p.isActive) ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td onClick={() => setShowModal({ edit: p })}
                      className="px-2 py-3 text-blue-500 hover:text-blue-700 cursor-pointer font-medium">
                      ✏️ Edit
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length > 5 && <button onClick={() => navigate('/admin/glamgully/products')} className="inline-block mt-4 cursor-pointer bg-sky-500 text-gray-100 rounded h-7 text-center px-3 ">view all</button>}
        </section>

        {/* Category Management */}
        <section className=' px-3 mb-10 '>
          <h2 className="text-xl md:text-2xl font-semibold mb-6">Category Management</h2>
          {category && category.map((c, i) => <div key={i} className={`flex my-1 justify-between items-center font-semibold  ${archive[c] ? "bg-gray-900 text-yellow-500" : "bg-black text-yellow-500"} px-3 rounded-md py-3 text-lg `}>
            <h1 className=' uppercase '>{c}</h1>
            <button onClick={() => {
              if (archive[c]) {
                archiveCategory(c);
                setArchive(prev => ({ ...prev, [c]: false }));
              } else {
                activeCategory(c);
                setArchive(prev => ({ ...prev, [c]: true }));
              }
            }} className={`px-3 py-1 rounded-full uppercase text-sm  ${archive[c] ? "bg-red-500" : "bg-green-500"} text-white  font-semibold`}>
              {archive[c] ? "archive" : "unarchive"}
            </button>
          </div>)}
        </section>

        {/* Customer Management */}
        <section className='my-4'>
          <h2 className="text-xl md:text-2xl font-semibold px-4 mb-4">Customer Management</h2>
          {customer.length > 0 ? <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="min-w-full text-center mb-2 ">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {customer && customer?.slice(0, 5).map((c, i) => <tr key={i}>
                  <td className="px-4 py-2">{c.fullname}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                </tr>)}
              </tbody>
            </table>
            {customer.length > 5 && <button onClick={() => navigate('/admin/glamgully/customers')} className="inline-block my-4 mx-4 cursor-pointer bg-sky-500 text-gray-100 rounded h-7 text-center px-3 ">view all</button>}
          </div> : <h1 className='w-full text-center pb-5 text-red-500 font-semibold'>No Customers </h1>}
        </section>

        {/* Reviews Management */}
        <section className="px-3 mb-10">
          <h2 className="text-xl md:text-2xl px-2 font-semibold mb-6">
            Reviews Management
          </h2>

          {/* Upload Box */}
          <div
            className="h-50 w-full border border-dashed rounded-xl flex flex-col justify-center items-center cursor-pointer transition hover:border-cyan-400 hover:bg-cyan-50"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("fileInput").click()}>
            {!image ? <>
              <h1 className="h-16 w-16 flex items-center justify-center rounded-full border-2 border-gray-400  text-3xl text-black/55 mb-3">
                +
              </h1>
              <p className="text-gray-500">Click or Drag & Drop to Upload</p>
            </> : <img src={image} alt="Preview" className="max-h-10/12 max-w-full object-cover object-top rounded" />
            }

            {/* Hidden File Input */}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange} />
          </div>
          <button onClick={() => { createReviewImg(imageFile) }} className={`px-2 py-1.5 rounded-md mt-4 uppercase text-sm   bg-green-500 text-white  font-semibold`}>
            Upload Review
          </button>
        </section>

      </main>
    </div > : <div className=" flex justify-center items-center h-full  w-full ">
      <img className=" object-contain h-2/4 w-2/5 "
        src={Loader} alt="loading..." />
    </div>
  );
}

export default AdminPanel
