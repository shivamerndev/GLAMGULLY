import { useContext, useEffect, useState } from "react";
import { ProductDataContext } from "../context/ProductContext";
import { Archive, CheckCircle, XCircle, Tag, Layers, AlertCircle } from 'lucide-react';
import ProgressLoader from "../utils/ProgressLoader";
import Confirm from "../utils/Confirm";
import { toast, ToastContainer } from "react-toastify";

const ArchiveCategory = () => {
    const { archiveCategory, categoryProduct } = useContext(ProductDataContext);
    const [archive, setArchive] = useState({});
    const [category, setcategory] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [confirm, setConfirm] = useState(false)

    useEffect(() => {
        categoryProduct().then((data) => {
            setcategory(data.categories);
            setArchive(() => {
                const initialArchiveState = {};
                data.categories.forEach(c => {
                    initialArchiveState[c.name] = data.activecategory.includes(c.name);
                });
                return initialArchiveState;
            });
        });
    }, [])

    const activeCount = category.filter(c => !archive[c.name]).length;
    const archivedCount = category.filter(c => archive[c.name]).length;

    const getClickedBtn = (btn) => {
        if (btn === "confirm") {
            setShowDialog(false);
            archiveCategory(showDialog, true).then(res => {
                setArchive(prev => ({ ...prev, [showDialog]: true }));
                console.log(res.result.modifiedCount,"product inactivated");
                toast.success("Category Archived Successfully!");
            });
        } else {
            setShowDialog(false)
        }
    }

    return (category ?
        <section className="px-4 py-6 ">
            {showDialog && <Confirm type="archive" getClick={getClickedBtn} />}
            <ToastContainer />
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-amber-900">Category Management</h2>

                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-green-700 font-medium">Active</p>
                                <p className="text-2xl font-bold text-green-900">{activeCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                                <Archive className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-red-700 font-medium">Archived</p>
                                <p className="text-2xl font-bold text-red-900">{archivedCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Categories List */}
            <div className="space-y-4">
                {category && category.map((c, i) => (
                    <div key={i}
                        className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${archive[c.name]
                            ? "bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300"
                            : "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300"
                            }`}>

                        <div className="relative flex justify-between items-center px-6 py-5">
                            {/* Category Info */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-3xl shadow-md transition-transform group-hover:scale-110`}>
                                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className={`text-2xl font-bold uppercase ${archive[c.name] ? "text-red-900" : "text-amber-900"
                                            }`}>
                                            {c.name}
                                        </h1>
                                        <span className={`px-3 py-1  rounded-full text-xs font-semibold flex items-center gap-1 ${archive[c.name]
                                            ? "bg-red-200 text-red-800"
                                            : "bg-green-200 text-green-800"
                                            }`}>
                                            {archive[c.name] ? (
                                                <>
                                                    <XCircle className="w-3 h-3" />
                                                    Archived
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-3 h-3" />
                                                    Active
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-1 font-medium ${archive[c.name] ? "text-red-700" : "text-amber-700"
                                        }`}>
                                        {archive[c.name]
                                            ? "This category is currently archived"
                                            : "This category is active and visible"}
                                    </p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={(e) => {
                                    if (e.target.textContent.toLowerCase() === "archive") {
                                        setShowDialog(c.name);
                                    } else {
                                        archiveCategory(c.name, false).then(res => {
                                            setArchive(prev => ({ ...prev, [c.name]: false }))
                                            console.log(res)
                                        });
                                    }
                                }}
                                className={`relative cursor-pointer px-6 py-3 rounded-xl font-bold text-sm uppercase transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${archive[c.name]
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                    : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                                    }`}>
                                {archive[c.name] ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Unarchive
                                    </>
                                ) : (
                                    <>
                                        <Archive className="w-4 h-4" />
                                        Archive
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Bottom Border Effect */}
                        <div className={`h-1 ${archive[c.name]
                            ? "bg-gradient-to-r from-red-400 to-orange-400"
                            : "bg-gradient-to-r from-amber-400 to-orange-400"
                            }`}></div>
                    </div>
                ))}
            </div>
            {/* Info Card */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900 mb-2">About Category Management</h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span><strong>Active categories</strong> are visible to customers and can accept new products</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span><strong>Archived categories</strong> are hidden from customers but products remain in the system</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                <span>You can <strong>unarchive</strong> a category anytime to make it visible again</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section> : <ProgressLoader />
    );
};

export default ArchiveCategory;