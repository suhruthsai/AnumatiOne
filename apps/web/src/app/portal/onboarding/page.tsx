'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  SectorType, 
  StateType, 
  LandType, 
  PollutionCategory, 
  BusinessProfile 
} from '@approvalos/shared';
import { 
  Compass, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Zap, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentProfile, setProfile } = useAppStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BusinessProfile>({
    ...currentProfile,
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Calculate dynamic trust score
      const baseTrust = formData.pastComplianceRecord === 'EXEMPLARY' ? 90 : 75;
      const finalProfile: BusinessProfile = {
        ...formData,
        id: `profile_${Date.now()}`,
        trustScore: baseTrust,
      };

      setProfile(finalProfile);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      router.push('/portal/journey');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Wizard Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Step {step} of 4: {
            step === 1 ? 'Industry & Enterprise' :
            step === 2 ? 'Location & Land Parcel' :
            step === 3 ? 'Capital & Utility Scale' : 'Environmental & Risk Profile'
          }</span>
          <span className="font-mono text-blue-400">{step * 25}% Complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-blue-500 to-accent-purple transition-all duration-300"
            style={{ width: `${step * 25}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {/* Step 1: Industry & Enterprise */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Register Your Industrial Enterprise
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about your company and core manufacturing sector to seed the Regulatory Digital Twin.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Legal Entity / Proposed Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Apex Lithium Batteries Pvt Ltd"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Core Manufacturing Sector
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'EV_MANUFACTURING', label: '⚡ EV & Battery Packs', desc: 'Lithium cell assembly, electric drive-trains' },
                    { id: 'PHARMA', label: '💊 Pharma & Bulk Drugs', desc: 'Active pharmaceutical ingredients (APIs), formulations' },
                    { id: 'RENEWABLE_ENERGY', label: '☀️ Solar & Clean Energy', desc: 'Photovoltaic cells, wind turbine parts' },
                    { id: 'CHEMICALS', label: '🧪 Specialty Chemicals', desc: 'Polymers, agrochemicals, dyes' },
                    { id: 'FOOD_PROCESSING', label: '🌾 Agro & Food Processing', desc: 'Cold storage, grain milling, packaged foods' },
                    { id: 'TEXTILES', label: '🧵 Textiles & Apparel', desc: 'Spinning, synthetic weaving, garmenting' },
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, sector: sec.id as SectorType })}
                      className={`text-left rounded-xl border p-3 transition-all ${
                        formData.sector === sec.id
                          ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/10'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{sec.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{sec.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="msme_checkbox"
                  checked={formData.isMsme}
                  onChange={(e) => setFormData({ ...formData, isMsme: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="msme_checkbox" className="text-xs font-medium text-slate-300">
                  Registered as Micro, Small, or Medium Enterprise (MSME / Udyam)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location & Land Parcel */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Location & Land Demarcation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                State policies and land categorization drastically influence your regulatory critical path.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Target State Authority
                  </label>
                  <select
                    value="MAHARASHTRA"
                    disabled
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white opacity-90 cursor-not-allowed focus:outline-none"
                  >
                    <option value="MAHARASHTRA">Maharashtra (MAITRI Single Window)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    District / Industrial Corridor
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Chakan MIDC Phase IV, Pune"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Land Parcel Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'GOVT_INDUSTRIAL_PARK', title: 'MIDC Industrial Park (Notified Zone)', desc: 'Pre-zoned, pre-cleared drainage, saves ~45 days' },
                    { id: 'PRIVATE_AGRICULTURAL', title: 'Private Agricultural Land', desc: 'Requires Land Conversion (CLU) & Cadastral Survey' },
                    { id: 'SEZ', title: 'Special Economic Zone (SEZ)', desc: 'Customs bonded, fast-track single desk' },
                    { id: 'BROWNFIELD_EXISTING', title: 'Brownfield Existing Plant', desc: 'Modification / expansion of existing factory' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, landType: l.id as LandType })}
                      className={`text-left rounded-xl border p-3 transition-all ${
                        formData.landType === l.id
                          ? 'border-blue-500 bg-blue-500/10 shadow-md'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{l.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{l.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Total Plot Area (Acres)
                  </label>
                  <input
                    type="number"
                    value={formData.landAreaAcres}
                    onChange={(e) => setFormData({ ...formData, landAreaAcres: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Built-up Factory Floor Area (Sq. Meters)
                  </label>
                  <input
                    type="number"
                    value={formData.builtUpAreaSqMeters}
                    onChange={(e) => setFormData({ ...formData, builtUpAreaSqMeters: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Capital & Utility Scale */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Capital Investment & Utilities
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Connected electrical loads and water draw determine DISCOM and CGWA sanction requirements.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Total Capital Outlay (₹ Crores)
                  </label>
                  <input
                    type="number"
                    value={formData.investmentInrCr}
                    onChange={(e) => setFormData({ ...formData, investmentInrCr: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Anticipated Direct Employees
                  </label>
                  <input
                    type="number"
                    value={formData.expectedEmployees}
                    onChange={(e) => setFormData({ ...formData, expectedEmployees: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Connected Power Load (kVA)
                  </label>
                  <input
                    type="number"
                    value={formData.powerRequiredKva}
                    onChange={(e) => setFormData({ ...formData, powerRequiredKva: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Loads &gt; 1000 kVA require High-Tension (HT) sub-station approval.
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Water Demand (Kilo-Litres / Day - KLD)
                  </label>
                  <input
                    type="number"
                    value={formData.waterRequiredKld}
                    onChange={(e) => setFormData({ ...formData, waterRequiredKld: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Environmental & Risk Profile */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Environmental & Scrutiny Classification
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Determines whether your project qualifies for Green Channel Instant Approval or requires EIA hearings.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  MPCB / CPCB Pollution Categorization
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'WHITE', label: 'White Category', desc: 'Zero emissions, instant deemed consent' },
                    { id: 'GREEN', label: 'Green Category', desc: 'Low emissions, Green Channel auto-approval' },
                    { id: 'ORANGE', label: 'Orange Category', desc: 'Medium pollution, standard review' },
                    { id: 'RED', label: 'Red Category', desc: 'High emissions, mandatory EIA/EC' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, pollutionCategory: p.id as PollutionCategory })}
                      className={`text-left rounded-xl border p-3 transition-all ${
                        formData.pollutionCategory === p.id
                          ? 'border-blue-500 bg-blue-500/10 shadow-md'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{p.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hazardousChemicals}
                    onChange={(e) => setFormData({ ...formData, hazardousChemicals: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <span className="text-xs text-slate-300">Hazardous Solvents (PESO)</span>
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.boilerInstalled}
                    onChange={(e) => setFormData({ ...formData, boilerInstalled: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <span className="text-xs text-slate-300">Steam Boiler Installed</span>
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.effluentDischarge}
                    onChange={(e) => setFormData({ ...formData, effluentDischarge: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600"
                  />
                  <span className="text-xs text-slate-300">Trade Effluent (ETP/ZLD)</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Promoter Compliance Track Record
                </label>
                <select
                  value={formData.pastComplianceRecord || 'EXEMPLARY'}
                  onChange={(e) => setFormData({ ...formData, pastComplianceRecord: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EXEMPLARY">Exemplary (Zero past violations, +15 Trust Score)</option>
                  <option value="CLEAN">Clean Record (New unit in standard standing)</option>
                  <option value="NEW_ENTRANT">First-time Entrepreneur / Start-up</option>
                  <option value="MINOR_ISSUES">Prior Minor Audit Observations</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Step
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-blue-600 to-accent-purple px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-500/25 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            {step === 4 ? (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Regulatory Digital Twin Journey Map
              </>
            ) : (
              <>
                Continue to Step {step + 1}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
