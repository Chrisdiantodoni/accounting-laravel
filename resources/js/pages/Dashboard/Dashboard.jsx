import Card from "@/components/ui/Card";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;
    return (
        <Card title={"Dashboard"}>
            <Head title="Dashboard" />
            <div className="text-base">Hallo {auth?.user?.name}</div>
        </Card>
    );
}
