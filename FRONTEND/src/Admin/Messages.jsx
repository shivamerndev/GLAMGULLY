import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Send,
    MessageSquare,
    Mail,
    Phone,
    Clock,
    CheckCheck,
    Eye,
    Trash2,
    Star,
    Archive,
    Reply,
    MoreVertical,
    User,
    Calendar,
    Tag,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    X,
    Paperclip,
    MessageSquareMoreIcon
} from 'lucide-react';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 8;

    // Mock data
    const mockMessages = [
        {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '+91 9876543210',
            subject: 'Order Delivery Issue',
            message: 'Hi, I ordered a product 5 days ago (Order #ORD-12345) but haven\'t received any tracking information. Can you please help me track my order?',
            category: 'orders',
            status: 'unread',
            priority: 'high',
            createdAt: '2025-09-28T10:30:00Z',
            replies: []
        },
        {
            id: 2,
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91 9123456789',
            subject: 'Product Return Request',
            message: 'I received a damaged product. The packaging was torn and the item inside is broken. I would like to return it and get a refund.',
            category: 'returns',
            status: 'replied',
            priority: 'high',
            createdAt: '2025-09-27T15:45:00Z',
            replies: [
                {
                    from: 'Admin',
                    text: 'We apologize for the inconvenience. Please share photos of the damaged product and we will process your return immediately.',
                    timestamp: '2025-09-27T16:00:00Z'
                }
            ]
        },
        {
            id: 3,
            name: 'Amit Patel',
            email: 'amit@example.com',
            phone: '+91 9988776655',
            subject: 'General Inquiry',
            message: 'Do you offer bulk discounts for corporate orders? We are interested in purchasing 50+ units.',
            category: 'general',
            status: 'unread',
            priority: 'medium',
            createdAt: '2025-09-28T09:15:00Z',
            replies: []
        },
        {
            id: 4,
            name: 'Sneha Reddy',
            email: 'sneha@example.com',
            phone: '+91 9444555666',
            subject: 'Payment Issue',
            message: 'My payment was deducted but the order is not showing in my account. Transaction ID: TXN123456789. Please help.',
            category: 'support',
            status: 'unread',
            priority: 'high',
            createdAt: '2025-09-28T11:00:00Z',
            replies: []
        },
        {
            id: 5,
            name: 'Vikram Singh',
            email: 'vikram@example.com',
            phone: '+91 9777888999',
            subject: 'Product Feedback',
            message: 'I recently purchased your wireless headphones and I\'m very impressed with the quality. Great product!',
            category: 'feedback',
            status: 'read',
            priority: 'low',
            createdAt: '2025-09-26T14:20:00Z',
            replies: []
        },
        {
            id: 6,
            name: 'Anita Desai',
            email: 'anita@example.com',
            phone: '+91 9555444333',
            subject: 'Size Exchange Request',
            message: 'I ordered a medium size jacket but it\'s too small. Can I exchange it for a large size?',
            category: 'returns',
            status: 'replied',
            priority: 'medium',
            createdAt: '2025-09-27T10:30:00Z',
            replies: [
                {
                    from: 'Admin',
                    text: 'Yes, we can arrange an exchange. Please initiate a return request from your orders page and select "Exchange" as the reason.',
                    timestamp: '2025-09-27T11:00:00Z'
                }
            ]
        },
        {
            id: 7,
            name: 'Karan Mehta',
            email: 'karan@example.com',
            phone: '+91 9222333444',
            subject: 'Product Availability',
            message: 'When will the Black Clover Pendant be back in stock? I\'ve been waiting to purchase it.',
            category: 'general',
            status: 'unread',
            priority: 'low',
            createdAt: '2025-09-28T08:45:00Z',
            replies: []
        },
        {
            id: 8,
            name: 'Meera Shah',
            email: 'meera@example.com',
            phone: '+91 9111222333',
            subject: 'Discount Code Issue',
            message: 'I tried using the discount code SAVE20 but it\'s showing as invalid. Can you please check?',
            category: 'support',
            status: 'unread',
            priority: 'medium',
            createdAt: '2025-09-28T12:15:00Z',
            replies: []
        }
    ];

    useEffect(() => {
        setTimeout(() => {
            setMessages(mockMessages);
            setFilteredMessages(mockMessages);
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        let filtered = messages;

        if (searchTerm) {
            filtered = filtered.filter(msg =>
                msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(msg => msg.status === statusFilter);
        }

        setFilteredMessages(filtered);
        setCurrentPage(1);
    }, [searchTerm, statusFilter, messages]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'read':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'replied':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'archived':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'orders':
                return '📦';
            case 'returns':
                return '↩️';
            case 'support':
                return '🛟';
            case 'feedback':
                return '⭐';
            case 'general':
                return '💬';
            default:
                return '📧';
        }
    };

    const formatDate = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const handleMarkAsRead = (id) => {
        setMessages(messages.map(msg =>
            msg.id === id ? { ...msg, status: 'read' } : msg
        ));
    };

    const handleReply = (id) => {
        if (!replyText.trim()) return;

        setMessages(messages.map(msg =>
            msg.id === id ? {
                ...msg,
                status: 'replied',
                replies: [...msg.replies, {
                    from: 'Admin',
                    text: replyText,
                    timestamp: new Date().toISOString()
                }]
            } : msg
        ));
        setReplyText('');
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this message?')) {
            setMessages(messages.filter(msg => msg.id !== id));
            setSelectedMessage(null);
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

    const messageStats = {
        total: messages.length,
        unread: messages.filter(m => m.status === 'unread').length,
        replied: messages.filter(m => m.status === 'replied').length,
        high: messages.filter(m => m.priority === 'high').length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-12 bg-amber-200 rounded-2xl w-64"></div>
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-white rounded-2xl"></div>
                            ))}
                        </div>
                        <div className="h-96 bg-white rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
            <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-amber-900 flex items-center gap-3">
                        <MessageSquareMoreIcon className="w-6 h-6 text-amber-700" />
                        Messages & Queries
                    </h1>
                    <p className="text-amber-700 font-medium">Manage customer inquiries and support requests</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-700 font-medium text-sm">Total Messages</span>
                            <MessageSquare className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-3xl font-bold text-amber-900">{messageStats.total}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-700 font-medium text-sm">Unread</span>
                            <Mail className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-3xl font-bold text-amber-900">{messageStats.unread}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-green-700 font-medium text-sm">Replied</span>
                            <CheckCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-900">{messageStats.replied}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-red-700 font-medium text-sm">High Priority</span>
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-3xl font-bold text-red-900">{messageStats.high}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-xl px-6 py-3 mb-4 border border-amber-200/50">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-white border-2 border-amber-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-400 text-amber-900 font-medium"
                            >
                                <option value="all">All Status</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                                <option value="archived">Archived</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600 pointer-events-none" />
                        </div>

                        <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Messages Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {currentMessages.length === 0 ? (
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-12 text-center border border-amber-200/50">
                            <MessageSquare className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-amber-900 mb-2">No Messages Found</h3>
                            <p className="text-amber-600">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        currentMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`bg-white rounded-3xl shadow-xl overflow-hidden border hover:shadow-2xl transition-all cursor-pointer ${message.status === 'unread' ? 'border-amber-400' : 'border-amber-200/50'
                                    }`}
                                onClick={() => {
                                    setSelectedMessage(message);
                                    if (message.status === 'unread') handleMarkAsRead(message.id);
                                }}
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {message.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-amber-900 mb-1">{message.name}</h3>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-amber-700">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {message.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(message.priority)}`}>
                                                {message.priority.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subject & Category */}
                                    <div className="mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">{getCategoryIcon(message.category)}</span>
                                            <h4 className="font-semibold text-amber-900">{message.subject}</h4>
                                        </div>
                                        <p className="text-sm text-amber-700 line-clamp-2">{message.message}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(message.status)}`}>
                                                {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                            </span>
                                            {message.replies.length > 0 && (
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-semibold">
                                                    {message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-amber-600 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(message.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-amber-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5 text-amber-700" />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === index + 1
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'hover:bg-amber-100 text-amber-700'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-amber-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5 text-amber-700" />
                        </button>
                    </div>
                )}

                {/* Message Detail Modal */}
                {selectedMessage && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 border-b border-amber-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-xl font-bold">
                                            {selectedMessage.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-amber-900 mb-1">{selectedMessage.name}</h2>
                                            <div className="space-y-1 text-sm text-amber-700">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {selectedMessage.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {selectedMessage.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="p-2 hover:bg-amber-200 rounded-xl transition-colors"
                                    >
                                        <X className="w-6 h-6 text-amber-700" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {/* Message */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-2xl">{getCategoryIcon(selectedMessage.category)}</span>
                                        <h3 className="text-xl font-bold text-amber-900">{selectedMessage.subject}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedMessage.priority)}`}>
                                            {selectedMessage.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                                        <p className="text-amber-900 leading-relaxed">{selectedMessage.message}</p>
                                        <p className="text-xs text-amber-600 mt-4 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(selectedMessage.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Previous Replies */}
                                {selectedMessage.replies.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-bold text-amber-900 mb-3">Previous Replies</h4>
                                        <div className="space-y-4">
                                            {selectedMessage.replies.map((reply, index) => (
                                                <div key={index} className="bg-green-50 rounded-2xl p-4 border border-green-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-green-900">{reply.from}</span>
                                                        <span className="text-xs text-green-600">{formatDate(reply.timestamp)}</span>
                                                    </div>
                                                    <p className="text-green-900">{reply.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reply Box */}
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 mb-2">Send Reply</label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your reply here..."
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-amber-200 flex gap-3">
                                <button
                                    onClick={() => handleReply(selectedMessage.id)}
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Reply
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="bg-red-100 hover:bg-red-200 text-red-700 py-3 px-6 rounded-xl font-semibold transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;