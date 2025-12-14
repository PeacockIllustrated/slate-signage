import { MarketingHero } from "@/components/marketing/MarketingHero";
import { SectionWrapper } from "@/components/marketing/SectionWrapper";
import { PricingCards } from "@/components/marketing/PricingCards";
import { Check, X } from "lucide-react";

export default function PricingPage() {
    return (
        <>
            <MarketingHero
                headline="Transparent Pricing"
                subhead="All plans include professional design. Slate operates designer-built systems — it does not replace them."
            />

            <SectionWrapper>
                <PricingCards
                    tiers={[
                        {
                            name: "Slate Static",
                            description: "Best for: small venues moving away from print",
                            price: "£39",
                            features: [
                                "Up to 5 screens",
                                "Static image menus",
                                "Initial professional menu design (Onesign)",
                                "Unlimited updates within that design",
                                "Basic scheduling",
                                "Screen status monitoring"
                            ],
                            cta: "Get Started",
                            href: "/contact"
                        },
                        {
                            name: "Slate Video",
                            description: "Best for: venues running specials, promos, and seasonal content",
                            price: "£59",
                            popular: true,
                            features: [
                                "Everything in Static, plus:",
                                "Video playback",
                                "Specials Studio",
                                "Designer-built Specials Templates",
                                "Image & video scheduling",
                                "Device-optimised playback"
                            ],
                            cta: "Get Started",
                            href: "/contact"
                        },
                        {
                            name: "Slate Pro",
                            description: "Best for: high-volume venues or multi-screen sites",
                            price: "£89",
                            features: [
                                "Everything in Video, plus:",
                                "Unlimited screens",
                                "4K assets",
                                "Quarterly design refresh (or monthly support)",
                                "Priority support",
                                "Advanced scheduling controls"
                            ],
                            cta: "Contact Sales",
                            href: "/contact"
                        },
                        {
                            name: "Slate Enterprise",
                            description: "Best for: multi-venue brands and rollouts",
                            price: "POA",
                            features: [
                                "Multi-location management",
                                "Centralised brand governance",
                                "Bespoke design system",
                                "Ongoing design partnership",
                                "SLA-backed software support",
                                "Dedicated account management"
                            ],
                            cta: "Contact Sales",
                            href: "/contact"
                        }
                    ]}
                />

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
                    <div className="bg-neutral-50 p-8 rounded-2xl">
                        <h3 className="text-xl font-bold mb-6">What "Design Included" means</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-neutral-600">
                                <Check className="h-5 w-5 text-green-600 shrink-0" />
                                Layouts, typography, spacing, hierarchy
                            </li>
                            <li className="flex gap-3 text-sm text-neutral-600">
                                <Check className="h-5 w-5 text-green-600 shrink-0" />
                                Designer-built templates and systems
                            </li>
                            <li className="flex gap-3 text-sm text-neutral-600">
                                <Check className="h-5 w-5 text-green-600 shrink-0" />
                                Controlled flexibility for updates
                            </li>
                        </ul>
                    </div>
                    <div className="p-8 rounded-2xl border border-neutral-100">
                        <h3 className="text-xl font-bold mb-6">What it does NOT mean</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-neutral-600">
                                <X className="h-5 w-5 text-red-400 shrink-0" />
                                Unlimited bespoke campaigns
                            </li>
                            <li className="flex gap-3 text-sm text-neutral-600">
                                <X className="h-5 w-5 text-red-400 shrink-0" />
                                Blank-canvas design tools
                            </li>
                            <li className="flex gap-3 text-sm text-neutral-600">
                                <X className="h-5 w-5 text-red-400 shrink-0" />
                                Replacing professional designers
                            </li>
                        </ul>
                        <p className="mt-8 text-sm text-neutral-500 italic">
                            "Design remains intentional. Slate enforces it."
                        </p>
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
}
