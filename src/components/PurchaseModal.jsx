import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Crown, Sparkles } from 'lucide-react';
import pixelHeart from '../assets/pixel-heart.png';

const PACKAGES = [
    {
        id: 'spark',
        title: 'Spark',
        rights: 100,
        price: 1000,
        save: null,
        badge: null,
        color: 'cyan',
        features: [
            '100 Search Rights',
            'Basic Signal Clarity',
            'Standard Algorithm'
        ]
    },
    {
        id: 'nebula',
        title: 'Nebula',
        rights: 250,
        price: 2500,
        save: 'SAVE 20%',
        badge: 'POPULAR',
        color: 'indigo',
        features: [
            '250 Search Rights',
            'Enhanced Discovery',
            'Previous Match Recall',
            'Priority Support'
        ]
    },
    {
        id: 'supernova',
        title: 'Supernova',
        rights: 1000,
        price: 5000,
        save: 'SAVE 50%',
        badge: 'BEST DEAL',
        color: 'purple',
        features: [
            '1000 Search Rights',
            'Priority Matching Queue',
            'Exquisite Profile Badge',
            'Algorithmic Boost',
            'VIP Status'
        ]
    }
];

export default function PurchaseModal({ onClose, onPurchase }) {
    const [selectedId, setSelectedId] = useState('supernova');

    const selectedPackage = PACKAGES.find(p => p.id === selectedId) || PACKAGES[2];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md"
            >
                {/* Global Close Area */}
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="relative w-full max-w-md bg-[#121214] rounded-t-[2rem] sm:rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
                >
                    {/* Header Image/Icon Section */}
                    <div className="pt-8 pb-6 flex flex-col items-center text-center px-6">
                        <div className="w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(255,0,85,0.4)]">
                            <img src={pixelHeart} alt="Logo" className="w-full h-full object-contain pixelated" />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-bold text-white tracking-tight">Quantum Access</h2>
                            <div className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                                PREMIUM
                            </div>
                        </div>

                        <p className="text-gray-400 text-xs max-w-[260px] leading-relaxed">
                            Only the most ambitious can show that their intentions are serious.
                        </p>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">

                        {/* Package List */}
                        <div className="space-y-3 mb-8">
                            {PACKAGES.map((pkg) => {
                                const isSelected = selectedId === pkg.id;
                                return (
                                    <div
                                        key={pkg.id}
                                        onClick={() => setSelectedId(pkg.id)}
                                        className={`
                                            relative p-4 rounded-2xl border cursor-pointer transition-all duration-200
                                            flex items-center gap-4
                                            ${isSelected
                                                ? 'bg-white text-black border-white'
                                                : 'bg-[#1a1a1a] text-white border-white/5 hover:bg-[#252525]'}
                                        `}
                                    >
                                        {/* Radio Circle */}
                                        <div className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                                            ${isSelected ? 'border-black bg-black' : 'border-white/30'}
                                        `}>
                                            {isSelected && <Check size={14} className="text-white" />}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-sm tracking-wide">{pkg.title}</span>
                                                {pkg.badge && (
                                                    <span className={`
                                                        text-[9px] font-black px-1.5 py-0.5 rounded
                                                        ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
                                                    `}>
                                                        {pkg.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                                                {pkg.save || 'Standard Plan'}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <div className="font-bold text-lg flex items-center justify-end gap-1">
                                                {pkg.price} <Star size={14} className={isSelected ? 'fill-black text-black' : 'fill-yellow-500 text-yellow-500'} />
                                            </div>
                                            <div className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                                                {pkg.rights} Rights
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Features Section */}
                        <div className="px-2 mb-24">
                            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">What you get:</h3>
                            <div className="space-y-4">
                                {selectedPackage.features.map((feature, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm text-gray-300">
                                        <span>{feature}</span>
                                        <Check size={16} className="text-white" />
                                    </div>
                                ))}
                                {/* Static filler features to match look if needed, or stick to dynamic */}
                            </div>
                        </div>

                    </div>

                    {/* Fixed Footer Button */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#121214] via-[#121214] to-transparent z-10">
                        <button
                            onClick={() => onPurchase(selectedPackage.rights)}
                            className="w-full py-4 rounded-xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
                        >
                            Pay {selectedPackage.price} Stars
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
