import { PageContent } from "@/components/page/PageContent";
import { PageSeoConfig } from "@/components/page/PageSeoConfig";
import { PageSettings } from "@/components/page/PageSettings";
import { PageToolbar } from "@/components/page/PageToolbar";
import { usePage } from "@/services/page.service";
import { useState } from "react";
import { useParams } from "react-router";
import { match } from "ts-pattern";

const tabs = [
    { id: "content", label: "Content", icon: "solar:file-text-linear" },
    { id: "settings", label: "Settings", icon: "solar:settings-linear" },
    { id: "seo", label: "SEO", icon: "solar:magnifier-linear" },
];

export default function Page() {
    const [activeTab, setActiveTab] = useState("content");
    const { slug } = useParams();
    const { data: page } = usePage(slug);

    console.log(page)

    return (
        <section>
            <PageToolbar
                tabs={tabs}
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
