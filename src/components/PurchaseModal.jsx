
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Crown, Sparkles, Loader2 } from 'lucide-react';
import pixelHeart from '../assets/pixel-heart.png';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';

export default function PurchaseModal({ onClose, onPurchase }) {
    const { t } = useLanguage();
    const { tg } = useTelegram();
    const [selectedId, setSelectedId] = useState('supernova');
    const [isLoading, setIsLoading] = useState(false);

    const PACKAGES = [
        {
            id: 'spark',
            title: 'Spark',
            rights: 100,
            price: 1000,
            save: null,
            badge: null,
            features: [
                `100 ${t('credits')}`,
                '2x Visibility',
                'See Who Liked You',
                'Priority Support',
                'Direct Messaging'
            ]
        },
        {
            id: 'nebula',
            title: 'Nebula',
            rights: 250,
            price: 2500,
            save: 'Smart Choice',
            badge: 'POPULAR',
            features: [
                `250 ${t('credits')}`,
                'Top Tier Visibility',
                'Exclusive Profile Badge',
                'Algorithm Boost',
                'Direct Messaging'
            ]
        },
        {
            id: 'supernova',
            title: 'Supernova',
            rights: 1000,
            price: 5000,
            save: 'SAVE 50%',
            badge: 'BEST VALUE',
            features: [
                `1000 ${t('credits')}`,
                'Top Tier Visibility',
                'Exclusive Profile Badge',
                'Algorithm Boost',
                'Direct Messaging'
            ]
        }
    ];

    const selectedPackage = PACKAGES.find(p => p.id === selectedId) || PACKAGES[2];

    const handleBuy = async () => {
        setIsLoading(true);
        try {
            console.log("Creating invoice for:", selectedPackage.title);

            const { data, error } = await supabase.functions.invoke('create-invoice', {
                body: {
                    title: `Happi ${selectedPackage.title}`,
                    description: `${selectedPackage.rights} search credits + premium features`,
                    price: selectedPackage.price,
                    // Payload helps us identify the package on the webhook side if needed
                    payload: JSON.stringify({
                        package_id: selectedPackage.id,
                        credits: selectedPackage.rights
                    }),
                    photo_url: "https://shwpblroitsxezihnaut.supabase.co/storage/v1/object/public/assets/premium_badge.png" // Optional
                }
            });

            if (error) throw error;

            const invoiceLink = data.result;
            console.log("Invoice Link:", invoiceLink);

            if (invoiceLink) {
                // Use Telegram SDK to open invoice
                tg.openInvoice(invoiceLink, (status) => {
                    console.log("Invoice Status:", status);
                    if (status === 'paid') {
                        console.log("Payment Successful!");
                        tg.close(); // Close App or just Modal? Maybe just modal
                        onPurchase(selectedPackage.rights); // Optimistic Update
                        onClose();
                    } else if (status === 'cancelled' || status === 'failed') {
                        console.log("Payment Cancelled");
                        setIsLoading(false);
                    } else {
                        setIsLoading(false);
                    }
                });
            } else {
                console.error("No invoice link returned");
                setIsLoading(false);
            }

        } catch (err) {
            console.error('Payment Error:', err);
            alert('Payment creation failed. Please try again.');
            setIsLoading(false);
        }
    };

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
                            <h2 className="text-xl font-bold text-white tracking-tight">Happi Dating</h2>
                            <div className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                                PREMIUM
                            </div>
                        </div>

                        <p className="text-gray-400 text-xs max-w-[260px] leading-relaxed">
                            Don't leave love to chance. Unlock full access to find your perfect match.
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
                                                {pkg.rights} Buttons
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
                            </div>
                        </div>

                    </div>

                    {/* Fixed Footer Button */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#121214] via-[#121214] to-transparent z-10">
                        <button
                            onClick={handleBuy}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2 ${isLoading ? 'opacity-80' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Processing...
                                </>
                            ) : (
                                `Pay ${selectedPackage.price} Stars`
                            )}
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
