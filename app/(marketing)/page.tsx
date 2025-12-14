import { MarketingHero } from "@/components/marketing/MarketingHero";
import { SectionWrapper } from "@/components/marketing/SectionWrapper";
import { NumberedSteps } from "@/components/marketing/NumberedSteps";
import { ScreenPreviewFrame } from "@/components/marketing/ScreenPreviewFrame";
import { CaseStudyTile } from "@/components/marketing/CaseStudyTile";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, History, MonitorCheck } from "lucide-react";

export default function MarketingHome() {
    return (
        <>
            <MarketingHero
                pill="New: Specials Studio"
                headline="Designer-approved menu updates, without the chaos."
                subhead="The operational system for digital signage. Design defines the system. Slate operates it."
                primaryCta={{ href: "/contact", label: "Book a Demo" }}
                secondaryCta={{ href: "/product", label: "How it works" }}
            >
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                    {/* Placeholder for actual screen mock */}
                    <div className="text-center">
                        <span className="block text-white/40 font-mono text-sm mb-2">LIVE PREVIEW</span>
                        <span className="text-3xl font-bold text-white tracking-widest">MENU BOARD 01</span>
                        <span className="block text-green-500 font-mono text-xs mt-4">● Synced 2m ago</span>
                    </div>
                </div>
            </MarketingHero>

            <SectionWrapper dark>
                <div className="max-w-3xl">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                        Design defines the system.<br />
                        Slate operates it.
                    </h2>
                    <p className="text-xl text-neutral-400 leading-relaxed">
                        Most digital signage tools try to be design tools, turning your menu boards into a chaotic canvas.
                        Slate is different. We lock the layout and empower your team to update content safely, ensuring brand consistency at scale.
                    </p>
                </div>
            </SectionWrapper>

            <SectionWrapper>
                <div className="mb-20">
                    <h2 className="text-3xl font-bold mb-4">How Slate works</h2>
                    <p className="text-neutral-500 max-w-xl">A strict separation of concerns between design and operations.</p>
                </div>
                <NumberedSteps
                    steps={[
                        {
                            title: "Choose Template",
                            description: "Select from designer-approved layouts. No blank canvases, ever.",
                        },
                        {
                            title: "Edit Content",
                            description: "Update prices, items, and specials in a safe, form-based interface.",
                        },
                        {
                            title: "Preview",
                            description: "See exactly how it looks on the screen before going live.",
                        },
                        {
                            title: "Publish",
                            description: "Push updates to one or one thousand screens instantly.",
                        },
                    ]}
                />
            </SectionWrapper>

            <SectionWrapper className="bg-neutral-50">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold mb-4">Protect the brand. Empower the team.</h2>
                    <p className="text-neutral-500">
                        Features designed to keep your menus looking professional, no matter who updates them.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-8 bg-white rounded-2xl border border-neutral-200">
                        <Lock className="h-8 w-8 text-neutral-950 mb-6" />
                        <h3 className="text-xl font-bold mb-3">Locked Layouts</h3>
                        <p className="text-neutral-500">
                            Designers define the constraints. Typography, spacing, and positioning are locked.
                            Restaurant managers can only change what you allow them to change.
                        </p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl border border-neutral-200">
                        <History className="h-8 w-8 text-neutral-950 mb-6" />
                        <h3 className="text-xl font-bold mb-3">History & Rollback</h3>
                        <p className="text-neutral-500">
                            Made a mistake? Revert to the previous version in one click.
                            Slate keeps a complete history of every change made to every screen.
                        </p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl border border-neutral-200">
                        <MonitorCheck className="h-8 w-8 text-neutral-950 mb-6" />
                        <h3 className="text-xl font-bold mb-3">Live Monitoring</h3>
                        <p className="text-neutral-500">
                            See what's playing on every screen in real-time.
                            Get alerts if a screen goes offline or content fails to sync.
                        </p>
                    </div>

                    <div className="p-8 bg-white rounded-2xl border border-neutral-200">
                        <CheckCircle2 className="h-8 w-8 text-neutral-950 mb-6" />
                        <h3 className="text-xl font-bold mb-3">Approval Workflows</h3>
                        <p className="text-neutral-500">
                            Optional approval steps for major changes.
                            Ensure nothing goes live without a manager's sign-off.
                        </p>
                    </div>
                </div>
            </SectionWrapper>

            <SectionWrapper>
                <h2 className="text-3xl font-bold mb-12">Proof of Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CaseStudyTile
                        client="Burger & Co."
                        metric="-4hrs"
                        description="Weekly time saved on menu updates across 12 locations."
                        href="/case-studies/burger-co"
                    />
                    <CaseStudyTile
                        client="The Coffee House"
                        metric="100%"
                        description="Brand consistency compliance achieved in month one."
                        href="/case-studies/coffee-house"
                    />
                    <CaseStudyTile
                        client="Fresh Eats"
                        metric="15min"
                        description="Time to deploy emergency price changes to 50 screens."
                        href="/case-studies/fresh-eats"
                    />
                </div>
            </SectionWrapper>

            < SectionWrapper dark className="text-center">
                <h2 className="text-4xl font-bold mb-8">Ready to take control?</h2>
                <p className="text-neutral-400 mb-10 max-w-xl mx-auto">
                    Join the forward-thinking brands that treat digital signage as a professional operation, not a design project.
                </p>
                <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-medium text-neutral-950 shadow-sm hover:bg-neutral-200 transition-colors"
                >
                    Book a Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </SectionWrapper>
        </>
    );
}
