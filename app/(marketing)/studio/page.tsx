import { MarketingHero } from "@/components/marketing/MarketingHero";
import { SectionWrapper } from "@/components/marketing/SectionWrapper";
import { Check } from "lucide-react";

export default function StudioPage() {
    return (
        <>
            <MarketingHero
                pill="Now Available"
                headline="Specials Studio"
                subhead="A template-first environment where design consistency is the only option."
                primaryCta={{ href: "/contact", label: "Request Access" }}
            />

            <SectionWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Not a creative tool. <br /> A productive one.</h2>
                        <p className="text-neutral-500 mb-6">
                            The Specials Studio is built for speed and safety. Unlike other "editors" that encourage tinkering, we restrict the canvas to ensure speed and brand compliance.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "No drag-and-drop",
                                "Strict layer locking",
                                "Designer-defined zones",
                                "Automatic price formatting",
                                "Asset library restrictions"
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <div className="h-5 w-5 rounded-full bg-neutral-950 flex items-center justify-center text-white shrink-0">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-neutral-100 rounded-2xl border border-neutral-200 aspect-square flex items-center justify-center text-neutral-400">
                        {/* Visual placeholder for the editor UI */}
                        <span className="font-mono text-sm">[Editor UI Placeholder]</span>
                    </div>
                </div>
            </SectionWrapper>

            <SectionWrapper className="bg-neutral-50">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Content is the variable. Layout is the constant.</h2>
                    <p className="text-neutral-500">
                        By removing layout tools from the operator's view, we eliminate 90% of user error.
                        Your team focuses on what they know—the daily specials—and the system handles the rest.
                    </p>
                </div>
            </SectionWrapper>
        </>
    );
}
