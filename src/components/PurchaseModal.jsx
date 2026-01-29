import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Check, X } from 'lucide-react';

const PackageCard = ({ title, rights, price, discount, color, onPurchase }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPurchase}
        className={`
            relative p-6 rounded-3xl border border-white/10
            bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]
            cursor-pointer overflow-hidden group
        `}
    >
        {/* Glow Effect */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 bg-${color}-500 group-hover:opacity-40 transition-opacity`} />

        {/* Discount Badge */}
        {discount && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                {discount}
            </div>
        )}

        {/* Content */}
        <div className="relative z-10 text-center space-y-4">
            <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-${color}-500/20 to-transparent flex items-center justify-center border border-${color}-500/30`}>
                <Zap size={20} className={`text-${color}-400`} />
            </div>

            <div>
                <h3 className="text-xl font-black italic tracking-tighter text-white">{title}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">{rights} SEARCHES</p>
            </div>

            <div className="py-2 border-y border-white/5">
                <div className="flex items-center justify-center gap-2 text-2xl font-black text-white">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    {price}
                </div>
            </div>

            <button className={`
                w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest
                bg-white/5 hover:bg-white/10 border border-white/5 hover:border-${color}-500/50
                transition-all duration-300
            `}>
                Acquire
            </button>
        </div>
    </motion.div>
);

export default function PurchaseModal({ onClose, onPurchase }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        >
            <div className="relative w-full max-w-lg bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-2xl p-6 overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-8 relative z-10 mt-4">
                    <h2 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        EXTEND RANGE
                    </h2>
                    <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-2">
                        Quantum Energy Depleted
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pb-4 custom-scrollbar">

                    {/* Tier 1: Spark */}
                    <div className="sm:col-span-1">
                        <PackageCard
                            title="SPARK"
                            rights="100"
                            price="1,000"
                            color="blue"
                            onPurchase={() => onPurchase(100)}
                        />
                    </div>

                    {/* Tier 2: Nebula */}
                    <div className="sm:col-span-1">
                        <PackageCard
                            title="NEBULA"
                            rights="250"
                            price="2,500"
                            color="purple"
                            onPurchase={() => onPurchase(250)}
                        />
                    </div>

                    {/* Tier 3: Supernova (Full Width) */}
                    <div className="sm:col-span-2">
                        <PackageCard
                            title="SUPERNOVA"
                            rights="1,000"
                            price="5,000"
                            discount="50% OFF"
                            color="pink"
                            onPurchase={() => onPurchase(1000)}
                        />
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
