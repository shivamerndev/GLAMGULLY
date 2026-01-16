import React from 'react'

const PersonalUse = () => {
    const tableData = [
        { combination: "have", use: "पास होना / खाना / करना (present)", example: "I have a car." },
        { combination: "have to", use: "करना पड़ता है", example: "I have to study." },
        { combination: "had to", use: "करना पड़ा (past)", example: "I had to go." },
        { combination: "have been + V-ing", use: "present perfect continuous (काम चल रहा है)", example: "I have been studying for 2 hours " },
        { combination: "had been + V-ing", use: "past perfect continuous (काम चल रहा था)", example: "They had been waiting for me." },
        { combination: "have + V3", use: "present perfect (काम हो चुका है)", example: "I have finished the work." },
        { combination: "had + V3", use: "past perfect (एक काम पहले हो चुका था)", example: "I had left before he came." },
        { combination: "should have + V3", use: "करना चाहिए था", example: "You should have called me." },
        { combination: "could have + V3", use: "कर सकता था", example: "I could have won the game." },
        { combination: "would have + V3", use: "होता अगर condition होती", example: "I would have helped you." },
        { combination: "must have + V3", use: "ज़रूर किया होगा", example: "He must have forgotten." },
        { combination: "might have + V3", use: "शायद किया होगा", example: "She might have left." },
        { combination: "may have + V3", use: "शायद किया होगा", example: "They may have seen it." },
        { combination: "have got", use: "have जैसा ही (British)", example: "I have got a laptop." },
        { combination: "having", use: "जब have का ing form use होता है", example: "I am having lunch." }
    ]
    const shortcuts = [
        { category: "Possession", formula: "have/ has/ had" },
        { category: "मजबूरी (Obligation)", formula: "have to/ has to/ had to" },
        { category: "Continuous", formula: "have been/ has been/ had been" },
        { category: "Completed", formula: "have+V3/has+V3 / had+V3" },
        { category: "Regret", formula: "should have" },
        { category: "Possibility", formula: "might have /may have" },
        { category: "Condition", formula: "would have" },
        { category: "Capability", formula: "could have" },
        { category: "Strong belief", formula: "must have" }
    ]

    return (
        <div className="min-h-screen md:px-8 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-100 md:py-4">

            {/* Main Table */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:mb-12 border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-purple-600">
                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                                    Combination
                                </th>
                                <th className="px-6 whitespace-nowrap py-4 text-center text-sm font-semibold uppercase tracking-wider">
                                    Use / Meaning
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                                    Example
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-700 hover:bg-gray-750 transition-colors duration-200 bg-gray-950 text-center`}>
                                    <td className="whitespace-nowrap md:px-6 py-2">
                                        <code className="text-green-400 font-semibold text-xl md:text-2xl bg-gray-800 px-3 py-0.5 rounded">
                                            {row.combination}
                                        </code>
                                    </td>
                                    <td className="md:px-6 py-4 font-semibold text-gray-200 ">
                                        {row.use}
                                    </td>
                                    <td className="px-6 whitespace-nowrap  py-4 text-gray-100  font-semibold italic">
                                        {row.example}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Shortcuts Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
                <h2 className="md:text-3xl text-xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    ✅ Shortcuts For Remember
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {shortcuts.map((shortcut, index) => (
                        <div
                            key={index}
                            className="bg-gray-900 rounded-xl md:p-5 p-2 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                            <div className="flex md:items-start gap-3">
                                <span className="text-green-400 text-xl">✔</span>
                                <div>
                                    <h3 className="font-semibold text-blue-300 md:mb-2">
                                        {shortcut.category}
                                    </h3>
                                    <p className="text-gray-400 text-sm font-mono">
                                        {shortcut.formula}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 text-gray-500">
                <p>💡 Practice makes perfect! Keep learning and improving your English.</p>
            </div>

        </div>
    )
}

export default PersonalUse