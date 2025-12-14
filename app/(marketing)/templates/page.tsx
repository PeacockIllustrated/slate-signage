import { MarketingHero } from "@/components/marketing/MarketingHero";
import { SectionWrapper } from "@/components/marketing/SectionWrapper";
import { ScreenPreviewFrame } from "@/components/marketing/ScreenPreviewFrame";

export default function TemplatesPage() {
    const templates = [
        { name: "Coffee Board V2", category: "Menu Board" },
        { name: "Burger Promo Lg", category: "Promo" },
        { name: "Drive-Thru A", category: "Digital" },
        { name: "Lobby Portrait", category: "Signage" },
        { name: "Bar List Dark", category: "Menu Board" },
        { name: "Weekend Special", category: "Promo" }
    ];

    return (
        <>
            <MarketingHero
                headline="Template Systems"
                subhead="Build once. Deploy everywhere. A library of locked assets for your team."
                primaryCta={{ href: "/contact", label: "Book a Demo" }}
            />

            <SectionWrapper>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {templates.map((t, i) => (
                        <div key={i} className="group cursor-default">
                            <ScreenPreviewFrame caption={`${t.category} • ${t.name}`} />
                        </div>
                    ))}
                </div>
            </SectionWrapper>
        </>
    );
}
