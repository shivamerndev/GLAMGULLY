import React, { useState } from "react";
import {
    AlertTriangle,
    CheckCircle,
    XCircle,
    AlertCircle,
    Trash2,
    Archive,
    LogOut,
    Info,
} from "lucide-react";

const Confirm = ({ type, getClick }) => {
    // Demo state to show different types
    const [showDialog, setShowDialog] = useState(true);
    const [dialogType, setDialogType] = useState(type); // delete, archive, logout, warning, info

    const dialogConfig = {
        delete: {
            icon: Trash2,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            title: "Delete Item",
            message:
                "Are you sure you want to delete this item? This action cannot be undone and all data will be permanently removed.",
            confirmText: "Yes, Delete",
            confirmStyle:
                "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
            cancelText: "No, Cancel",
            cancelStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        },
        archive: {
            icon: Archive,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            title: "Archive Category",
            message:
                "Are you sure you want to archive this category? It will be hidden from customers but can be restored later.",
            confirmText: "Yes, Archive",
            confirmStyle:
                "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
            cancelText: "Cancel",
            cancelStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        },
        logout: {
            icon: LogOut,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            title: "Logout Confirmation",
            message:
                "Are you sure you want to logout? You will need to login again to access your account.",
            confirmText: "Yes, Logout",
            confirmStyle:
                "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
            cancelText: "Stay Logged In",
            cancelStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        },
        warning: {
            icon: AlertTriangle,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            title: "Warning",
            message:
                "This action may have consequences. Are you sure you want to proceed with this operation?",
            confirmText: "Yes, Proceed",
            confirmStyle:
                "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
            cancelText: "Go Back",
            cancelStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        },
        info: {
            icon: Info,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            title: "Information",
            message:
                "Do you want to save changes before leaving? Unsaved changes will be lost if you continue.",
            confirmText: "Yes, Continue",
            confirmStyle:
                "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
            cancelText: "Cancel",
            cancelStyle: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        },
    };

    const config = dialogConfig[dialogType];
    const Icon = config.icon;

    const handleConfirm = () => {
        setShowDialog(false);
        getClick("confirm");
    };

    const handleCancel = () => {
        setShowDialog(false);
        getClick("cancel");
    };

    return (
        < >
            {/* Confirmation Dialog */}
            {showDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                        {/* Icon Section */}
                        <div
                            className={`${config.iconBg} p-8 text-center relative overflow-hidden`}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                            </div>

                            <div className="relative">
                                <div
                                    className={`w-20 h-20 mx-auto ${config.iconBg} rounded-full flex items-center justify-center mb-4 animate-bounce-slow ring-4 ring-white shadow-lg`}
                                >
                                    <Icon className={`w-10 h-10 ${config.iconColor}`} />
                                </div>
                                <h2 className={`text-2xl font-bold ${config.iconColor}`}>
                                    {config.title}
                                </h2>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8">
                            <p className="text-gray-700 text-center leading-relaxed mb-6">
                                {config.message}
                            </p>

                            {/* Warning Note (Optional) */}
                            {dialogType === "delete" && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-red-900 mb-1">
                                                Warning!
                                            </p>
                                            <p className="text-xs text-red-700">
                                                This is a permanent action and cannot be reversed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    className={`flex-1 ${config.cancelStyle} py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-md`}
                                >
                                    <XCircle className="w-5 h-5" />
                                    {config.cancelText}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`flex-1 ${config.confirmStyle} text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg`}>
                                    <CheckCircle className="w-5 h-5" />
                                    {config.confirmText}
                                </button>
                            </div>
                        </div>

                        {/* Bottom Accent Line */}
                        <div className={`h-1 ${config.iconBg}`}></div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
        </>
    );
};

export default Confirm;
