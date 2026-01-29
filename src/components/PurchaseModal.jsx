import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Check, X, Crown, Sparkles } from 'lucide-react';

// --- Components ---

const Badge = ({ text, color }) => (
    <div className={`
        absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full 
        bg-gradient-to-r from-${color}-500 to-${color}-600 
        text-white text-[10px] font-black uppercase tracking-widest shadow-lg z-20
        flex items-center gap-1 whitespace-nowrap
    `}>
        <Crown size={10} className="fill-white/50" />
        {text}
    </div>
);

const Benefit = ({ text }) => (
    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium tracking-wide">
        <Check size={12} className="text-green-400" />
        {text}
    </div>
);

const PackageCard = ({ title, rights, price, discount, color, isPopular, onPurchase, benefits }) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPurchase}
        className={`
            relative p-1 rounded-[2rem] cursor-pointer group w-full
            ${isPopular ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-600' : 'bg-white/5 hover:bg-white/10'}
            transition-all duration-300 shadow-2xl
        `}
    >
        {/* Inner Content */}
        <div className={`
            relative h-full w-full rounded-[1.9rem] p-6 
            flex flex-col items-center text-center overflow-hidden
            ${isPopular ? 'bg-[#150520]' : 'bg-[#0a0a0a]'}
        `}>
            {/* Background Glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-20 bg-${color}-500 group-hover:opacity-40 transition-opacity`} />

            {isPopular && <Badge text="MOST POPULAR" color="orange" />}
            {discount && (
                <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded-md animate-pulse">
                    {discount}
                </div>
            )}

            {/* Icon */}
            <div className={`
                w-14 h-14 mb-4 rounded-2xl rotate-3 group-hover:rotate-12 transition-transform duration-300
                bg-gradient-to-br from-${color}-500/20 to-transparent 
                border border-${color}-500/30 flex items-center justify-center
                shadow-[0_0_20px_rgba(0,0,0,0.5)]
            `}>
                <Zap size={24} className={`text-${color}-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
            </div>

            {/* Title & Rights */}
            <h3 className={`text-2xl font-black italic tracking-tighter text-white mb-1 ${isPopular ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400' : ''}`}>
                {title}
            </h3>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 text-${color}-400`}>
                {rights} SEARCH RIGHTS
            </p>

            {/* Price */}
            <div className="flex items-center justify-center gap-1.5 mb-6 bg-white/5 px-6 py-2 rounded-xl border border-white/5">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-black text-white">{price}</span>
            </div>

            {/* Benefits */}
            <div className="space-y-2 mb-6 w-full px-4 text-left">
                {benefits.map((b, i) => <Benefit key={i} text={b} />)}
            </div>

            {/* CTA Button */}
            <button className={`
                w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em]
                transition-all duration-300 transform group-hover:-translate-y-1
                ${isPopular
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-[0_10px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_15px_30px_rgba(234,88,12,0.5)]'
                    : `bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-${color}-500/50`}
            `}>
                {isPopular ? 'Claim Offer' : 'Select'}
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
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/90 backdrop-blur-xl"
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full max-w-4xl bg-[#050505] sm:rounded-[2.5rem] rounded-t-[2.5rem] border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                {/* Background FX */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 center w-full h-1/2 bg-gradient-to-b from-purple-900/10 to-transparent" />
                    <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full" />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-50 border border-white/5"
                >
                    <X size={24} />
                </button>

                <div className="relative z-10 p-6 sm:p-10 pb-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-4"
                        >
                            <Sparkles size={12} /> Limit Reached
                        </motion.div>

                        <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white mb-3">
                            RECHARGE YOUR <br className="sm:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                ORACLE
                            </span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                            Don't let the cosmic connection fade. Acquire more rights to continue searching the quantum field for your match.
                        </p>
                    </div>

                    {/* Packages Grid - Optimized for Sales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center">

                        {/* 1. Spark (Starter) */}
                        <div className="order-2 md:order-1">
                            <PackageCard
                                title="SPARK"
                                rights="100"
                                price="1,000"
                                color="blue"
                                benefits={['100 Search Rights', 'Basic Priority', 'Standard Support']}
                                onPurchase={() => onPurchase(100)}
                            />
                        </div>

                        {/* 2. Supernova (Hero) */}
                        <div className="order-1 md:order-2 transform md:-translate-y-4">
                            <PackageCard
                                title="SUPERNOVA"
                                rights="1,000"
                                price="5,000"
                                discount="50% OFF"
                                color="pink"
                                isPopular={true}
                                benefits={['1000 Search Rights', 'Instant Matching', 'VIP Support Access', 'Profile Highlight']}
                                onPurchase={() => onPurchase(1000)}
                            />
                        </div>

                        {/* 3. Nebula (Middle) */}
                        <div className="order-3 md:order-3">
                            <PackageCard
                                title="NEBULA"
                                rights="250"
                                price="2,500"
                                color="purple"
                                benefits={['250 Search Rights', 'Enhanced Speed', 'Recall Last Match']}
                                onPurchase={() => onPurchase(250)}
                            />
                        </div>

                    </div>

                    {/* Trust / Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                            Secure Transaction • Instant Delivery • 24/7 Support
                        </p>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
}
