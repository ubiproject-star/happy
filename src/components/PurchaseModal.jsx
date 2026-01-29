import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Check, X, Crown, Sparkles, Infinity as InfinityIcon } from 'lucide-react';

// --- Sub-components ---

const Badge = ({ text, color }) => (
    <div className={`
        absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full 
        bg-gradient-to-r from-${color}-500 to-${color}-600 
        text-white text-[10px] font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20
        flex items-center gap-1 whitespace-nowrap border border-white/10
    `}>
        <Crown size={10} className="fill-white" />
        {text}
    </div>
);

const Benefit = ({ text }) => (
    <div className="flex items-start gap-2 text-xs text-gray-300 font-medium tracking-wide leading-relaxed">
        <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
        <span>{text}</span>
    </div>
);

const PackageCard = ({ title, rights, price, discount, color, isPopular, onPurchase, benefits, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPurchase}
        className={`
            relative p-[1px] rounded-[2rem] cursor-pointer group w-full flex flex-col h-full
            ${isPopular
                ? 'bg-gradient-to-b from-yellow-400/80 via-purple-500/50 to-purple-900/50 shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                : 'bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 hover:to-white/5'}
            transition-all duration-300
        `}
    >
        {/* Inner Content */}
        <div className={`
            relative h-full w-full rounded-[2rem] p-6 sm:p-8
            flex flex-col items-center text-center overflow-hidden
            ${isPopular ? 'bg-[#1a0b2e]/90' : 'bg-[#0f0f0f]/90'}
            backdrop-blur-xl
        `}>
            {/* Conditional Background Glow */}
            <div className={`
                absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-opacity duration-500
                bg-${color}-500 group-hover:opacity-40
            `} />

            {isPopular && <Badge text="BEST VALUE" color="amber" />}

            {discount && (
                <div className="absolute top-5 right-5 bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse">
                    {discount}
                </div>
            )}

            {/* Icon */}
            <div className={`
                w-16 h-16 mb-6 rounded-2xl rotate-3 group-hover:rotate-12 transition-transform duration-500
                bg-gradient-to-br from-${color}-500/20 to-transparent 
                border border-${color}-500/30 flex items-center justify-center
                shadow-[0_0_30px_rgba(0,0,0,0.3)]
            `}>
                <Zap size={28} className={`text-${color}-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
            </div>

            {/* Title & Rights */}
            <h3 className={`text-2xl font-black italic tracking-tighter text-white mb-1 ${isPopular ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500' : ''}`}>
                {title}
            </h3>
            <p className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-8 text-${color}-400 opacity-90`}>
                {rights} SEARCH RIGHTS
            </p>

            {/* Price */}
            <div className="flex items-center justify-center gap-2 mb-8 bg-white/5 px-8 py-3 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors w-full">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="text-3xl font-black text-white">{price}</span>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-8 w-full text-left flex-grow">
                {benefits.map((b, i) => <Benefit key={i} text={b} />)}
            </div>

            {/* CTA Button */}
            <button className={`
                w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] relative overflow-hidden
                transition-all duration-300 shadow-lg
                ${isPopular
                    ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white hover:brightness-110 shadow-amber-500/20'
                    : `bg-white/5 hover:bg-white/10 text-white border border-white/10 group-hover:border-${color}-500/50`}
            `}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPopular ? 'Claim Power' : 'Select'}
                    {isPopular && <Sparkles size={14} />}
                </span>
                {/* Button Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
            </button>
        </div>
    </motion.div>
);

export default function PurchaseModal({ onClose, onPurchase }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-2xl"
            >
                {/* Global Close Area (Click outside) */}
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ y: 50, scale: 0.95, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: 50, scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                    className="relative w-full max-w-5xl bg-[#050505] rounded-t-[2.5rem] sm:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                >
                    {/* Background Ambience */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[inherit]">
                        <div className="absolute top-0 left-1/3 w-full h-1/2 bg-gradient-to-b from-purple-900/10 to-transparent blur-3xl opacity-50" />
                        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full" />
                    </div>

                    {/* Navbar / Close */}
                    <div className="flex justify-between items-center p-6 pb-2 z-20">
                        <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest pl-2">
                            <InfinityIcon size={14} /> Quantum Store
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5 active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="relative z-10 overflow-y-auto custom-scrollbar p-6 sm:p-10 pt-4 pb-12">

                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter text-white mb-4 drop-shadow-2xl">
                                UNLOCK <br className="sm:hidden" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-amber-300 animate-gradient-x">
                                    THE SOURCE
                                </span>
                            </h2>
                            <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed border-t border-white/5 pt-4">
                                Your journey requires energy. Choose a quantum packet to continue deciphering the signals of the universe.
                            </p>
                        </div>

                        {/* Packages Grid - Responsive */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">

                            {/* 1. Spark (Starter) */}
                            <div className="order-2 lg:order-1 h-full">
                                <PackageCard
                                    title="SPARK"
                                    rights="100"
                                    price="1,000"
                                    color="cyan"
                                    delay={0.1}
                                    benefits={['100 Search Rights', 'Basic Signal Clarity', 'Standard Algorithm']}
                                    onPurchase={() => onPurchase(100)}
                                />
                            </div>

                            {/* 2. Supernova (Hero) */}
                            <div className="order-1 lg:order-2 h-full lg:-mt-6 lg:mb-2 transform transition-transform">
                                <PackageCard
                                    title="SUPERNOVA"
                                    rights="1,000"
                                    price="5,000"
                                    discount="50% OFF"
                                    color="purple"
                                    isPopular={true}
                                    delay={0}
                                    benefits={['1000 Search Rights', 'Priority Matching Queue', 'Exquisite Profile Badge', 'Algorithmic Boost']}
                                    onPurchase={() => onPurchase(1000)}
                                />
                            </div>

                            {/* 3. Nebula (Middle) */}
                            <div className="order-3 lg:order-3 h-full">
                                <PackageCard
                                    title="NEBULA"
                                    rights="250"
                                    price="2,500"
                                    color="indigo"
                                    delay={0.2}
                                    benefits={['250 Search Rights', 'Enhanced Discovery', 'Previous Match Recall']}
                                    onPurchase={() => onPurchase(250)}
                                />
                            </div>

                        </div>

                        {/* Footer Trust */}
                        <div className="mt-12 text-center border-t border-white/5 pt-8">
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest flex items-center justify-center gap-4">
                                <span className="flex items-center gap-1"><Check size={10} /> Instant Activation</span>
                                <span className="flex items-center gap-1"><Check size={10} /> Secure Processing</span>
                            </p>
                        </div>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
