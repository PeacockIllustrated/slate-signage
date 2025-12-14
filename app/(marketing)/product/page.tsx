import { MarketingHero } from "@/components/marketing/MarketingHero";
import { SectionWrapper } from "@/components/marketing/SectionWrapper";
import { NumberedSteps } from "@/components/marketing/NumberedSteps";
import Link from "next/link";
import { LayoutTemplate, Pencil, Upload, MonitorPlay } from "lucide-react";

export default function ProductPage() {
    return (
        <>
            <MarketingHero
                headline="The separation of Design & Operations."
                subhead="Slate isn't a design tool. It's an operational system that protects your design investment."
                primaryCta={{ href: "/contact", label: "Book a Demo" }}
            />

            <SectionWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">The "Blank Canvas" Problem</h2>
                        <p className="text-neutral-500 mb-6 leading-relaxed">
                            When you give store managers a drag-and-drop design tool, you get chaos.
                            Fonts change, colors drift, and layouts break. The brand you built gets eroded one edit at a time.
                        </p>
                        <p className="text-neutral-500 leading-relaxed">
                            Slate solves this by locking the layer that matters (Design) and opening the layer that needs agility (Content).
                        </p>
                    </div>
                    <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-200">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-red-100 shadow-sm opacity-50">
                                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                                    <span className="font-bold text-lg">?</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-neutral-900">Typical "Designer"</h4>
                                    <p className="text-xs text-neutral-500">Unrestricted editing = Broken layouts</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200 shadow-md">
                                <div className="h-10 w-10 bg-neutral-950 rounded-full flex items-center justify-center text-white">
                                    <LayoutTemplate className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-neutral-900">Slate Operator</h4>
                                    <p className="text-xs text-neutral-500">Locked constraints = Perfect brand</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold mb-4">How the system works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-950 mb-6">
                            <LayoutTemplate className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold mb-2">1. Layout</h3>
                        <p className="text-sm text-neutral-500">Designers build templates in the Studio.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-950 mb-6">
                            <Pencil className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold mb-2">2. Content</h3>
                        <p className="text-sm text-neutral-500">Managers update items, prices, and stock.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-950 mb-6">
                            <MonitorPlay className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold mb-2">3. Publish</h3>
                        <p className="text-sm text-neutral-500">Changes deploy to specific screens instantly.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-950 mb-6">
                            <Upload className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold mb-2">4. Sync</h3>
                        <p className="text-sm text-neutral-500">Screens cache content for offline playback.</p>
                    </div>
                </div>

            </SectionWrapper>

            <SectionWrapper dark className="text-center">
                <h2 className="text-3xl font-bold mb-8">Stop fighting with design tools. Start operating.</h2>
                <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-medium text-neutral-950 shadow-sm hover:bg-neutral-200 transition-colors"
                >
                    Get Started
                </Link>
            </SectionWrapper>

        </>
    );
}
