import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from "react-toastify"
import { ProductDataContext } from '../context/ProductContext'

const FormProduct = ({ handleBackdropClick, setShowModal, EditProduct }) => {
    const { createProduct, editProduct, deleteProduct } = useContext(ProductDataContext)
    const data = { title: "", price: "", description: "", category: "", quantity: "", discount: "" }
    const [form, setForm] = useState(data)
    const [productimg, setProductImg] = useState([])

    const formhandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (!productimg && !EditProduct?.edit) return toast.error("Product Image required!");
        productimg.forEach((file) => {
            if (file instanceof File) {
                formData.append("productimage", file)
            }
        })
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });
        // return console.log(Object.keys(data))
        !EditProduct?.edit ? createProduct(formData).then(res => {
            toast.success(res.message)
            setShowModal(false)
        }).catch(err => alert(err)) : editProduct(form).then(res => {
            toast.success("Product updated successfully.")
            setForm(data)
            setShowModal(false)
        }).catch(err => toast.error(err.message))
    }
    useEffect(() => {
        if (EditProduct?.edit) {
            setForm(EditProduct?.edit)
        }
    }, [EditProduct?.edit])
    return (
        <div id="modal-backdrop" onClick={handleBackdropClick} className="fixed inset-0 flex items-center justify-center bg-[#000000a5] bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
                <ToastContainer />
                <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-600">&times;</button>
                <h3 onClick={() => setShowModal(true)} className="text-xl font-semibold mb-4">{!EditProduct.edit ? "Add New Product" : "Edit Product"}</h3>
                <form onSubmit={formhandler} >
                    <div className="flex flex-col items-center">
                        <label htmlFor="product-image-upload" className="flex justify-center py-1 items-center px-4 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <input multiple onChange={(e) => {
                                const files = (e.target.files);
                                setProductImg([...files])
                            }} id="product-image-upload" type="file" className="hidden" />
                            {/* {productimg ? <img src={URL.createObjectURL(productimg)} alt="Preview" className=" w-10 h-10 object-cover rounded border-gray-500" /> : <p className="py-4 text-sm  text-gray-500"><span className="font-semibold">Click to upload</span> or drag & drop</p>} */}
                            {<p className="py-4 text-sm capitalize font-semibold  text-gray-700">{productimg?.length > 0 ? ` You choosed ${productimg?.length} files.` : "Click to upload or drag & drop"}</p>}
                        </label>
                        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} type="text" placeholder="Product Name" className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                        <input  type="radio" placeholder="Limited" className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                        <input required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" placeholder="Price" className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                        <input required value={form.discount || ''} onChange={(e) => setForm({ ...form, discount: e.target.value })} type="number" placeholder="Discount % (Optional)" className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                        <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} type="text" placeholder="Category" className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                        <input required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} type="number" placeholder="Quantity (Stock)" className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600  mt-4 text-white px-4 py-2 rounded hover:bg-blue-700">{!EditProduct?.edit ? "ADD NEW PRODUCT" : "UPDATE PRODUCT"}</button>
                    {EditProduct?.edit && <button onClick={() => {
                        deleteProduct(EditProduct?.edit._id).then(res => {
                            toast.success(res.message)
                            setShowModal(false)
                        }).catch(err => toast.error(err.message))
                    }} className="bg-rose-600 absolute right-6 mt-4 text-white px-4 py-2 rounded hover:bg-red-500">DELETE</button>}
                </form>
            </div>
        </div>
    )
}

export default FormProduct
