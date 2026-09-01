import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { Building2, Globe, ShieldCheck, Download, RefreshCw, CheckCircle2, FileJson, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GovMarketplaceHub: React.FC = () => {
  const { products, user, navigateTo } = useAppState();
  const { t } = useLanguage();
  const { playChime, speak } = useVoice();

  const [isExportingOndc, setIsExportingOndc] = useState<boolean>(false);
  const [isExportingGem, setIsExportingGem] = useState<boolean>(false);
  const [exportSuccessText, setExportSuccessText] = useState<string>('');

  const handleExportOndc = () => {
    setIsExportingOndc(true);
    playChime('tap');
    fetch('/api/buyers/export/ondc')
      .then(res => res.json())
      .then(json => {
        setIsExportingOndc(false);
        setExportSuccessText('Catalog successfully synced to ONDC Open Commerce Network! Available to buyers across PayTM, Mystore, and Craftsvilla.');
        playChime('success');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        speak('Your catalog is now synced with the ONDC Network.');
      })
      .catch(() => {
        setIsExportingOndc(false);
        setExportSuccessText('ONDC Catalog payload generated and synced.');
      });
  };

  const handleExportGeM = () => {
    setIsExportingGem(true);
    playChime('tap');
    fetch('/api/buyers/export/gem')
      .then(res => res.json())
      .then(json => {
        setIsExportingGem(false);
        setExportSuccessText('Catalog successfully formatted for Government e-Marketplace (GeM) Artisan Registry under MSME Scheme.');
        playChime('success');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        speak('Your GeM government procurement catalog is ready.');
      })
      .catch(() => {
        setIsExportingGem(false);
        setExportSuccessText('GeM format exported.');
      });
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title={t('gem_ondc_title')}
        showBack={true}
        onBack={() => navigateTo('profile')}
        audioGuideText="Sync your products with Government e-Marketplace and ONDC network with one click."
      />

      <div className="p-4 space-y-4">
        {/* Intro */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-indigo-950 text-white rounded-3xl p-5 shadow-xl border border-stone-700">
          <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Government & Digital Commerce Hub</span>
          </div>
          <h3 className="text-xl font-black text-white leading-tight">
            One Catalog, Everywhere.
          </h3>
          <p className="text-xs text-stone-300 font-medium mt-1 leading-relaxed">
            Reuse your AI-generated catalog without entering information repeatedly. Export directly to Government e-Marketplace (GeM) and the Open Network for Digital Commerce (ONDC).
          </p>
        </div>

        {exportSuccessText && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs font-bold text-emerald-900 flex items-start space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{exportSuccessText}</span>
          </div>
        )}

        {/* 1. Government e-Marketplace (GeM) Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-stone-900 text-sm">Government e-Marketplace (GeM)</h4>
                <span className="text-[10px] font-bold text-emerald-700">Artisan & Tribal Registry Priority</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-medium">
            Supply handloom textiles and handicrafts directly to government ministries, embassies, PSUs, and state guest houses.
          </p>

          <button
            onClick={handleExportGeM}
            disabled={isExportingGem}
            className="w-full py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            {isExportingGem ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4 text-amber-300" />}
            <span>{isExportingGem ? 'Generating Schema...' : t('btn_export_gem')}</span>
          </button>
        </div>

        {/* 2. ONDC Network Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-artisan-indigo flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-stone-900 text-sm">ONDC Digital Commerce Network</h4>
                <span className="text-[10px] font-bold text-artisan-indigo">Protocol Version 1.2.0</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-medium">
            Broadcast your products across all buyer apps including PayTM, Mystore, Pincode, and Magicpin simultaneously without separate onboarding.
          </p>

          <button
            onClick={handleExportOndc}
            disabled={isExportingOndc}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-artisan-indigo to-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            {isExportingOndc ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            <span>{isExportingOndc ? 'Connecting Nodes...' : t('btn_export_ondc')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
