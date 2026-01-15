import { PageContent } from "@/components/page/PageContent";
import { PageSeoConfig } from "@/components/page/PageSeoConfig";
import { PageSettings } from "@/components/page/PageSettings";
import { PageToolbar } from "@/components/page/PageToolbar";
import { isDevCustomization } from "@/lib/utils";
import { usePage } from "@/services/page.service";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { match } from "ts-pattern";

export default function Page() {
    const { slug } = useParams();
    const { data: page } = usePage(slug);

    const filteredTabs = useMemo(() => {
        const baseTabs = [
            { id: "content", label: "Content", icon: "solar:file-text-linear" },
        ];

        if (isDevCustomization()) {
            baseTabs.push(
                { id: "settings", label: "Settings", icon: "solar:settings-linear" },
                { id: "seo", label: "SEO", icon: "solar:magnifier-linear" },
            );
        } else {
            // In production, we might still want SEO?
            // User said "only can edit content only".
            // SEO is content-like but often considered meta.
            // I'll hide both Settings and SEO to be sure, or just Settings.
            // Let's hide both as they are "other properties".
            // baseTabs.push({ id: "seo", label: "SEO", icon: "solar:magnifier-linear" });
        }

        return baseTabs;
    }, []);

    const [activeTab, setActiveTab] = useState("content");

    console.log(page)

    return (
        <section>
            <PageToolbar
                tabs={filteredTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {match(activeTab)
                .with("content", () => <PageContent page={page} />)
                .with("settings", () => <PageSettings page={page} />)
                .with("seo", () => <PageSeoConfig page={page} />)
                .otherwise(() => (
                    <PageContent page={page} />
                ))}
        </section>
    );
}
