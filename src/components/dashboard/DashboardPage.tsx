import Link from "next/link";
import { Plus } from "lucide-react";
import { Caveat } from "next/font/google";

const quoteFont = Caveat({
    subsets: ["latin"],
    weight: "600",
});

export default function DashboardPage() {
    return (
        <section className="space-y-6">
            {/* Dashboard heading and current month */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#123c35]">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-[#4e7069]">
                        Your finances at a glance.
                    </p>
                </div>

                {/* Current month display */}
                <div className="text-center sm:mr-4">
                    <p className="mb-1 text-xs text-[#4e7069]">
                        Month
                    </p>

                    <p className="rounded-full bg-white px-3 py-1 text-sm text-[#17324d]">
                        {new Intl.DateTimeFormat("en-US", {
                            month: "long",
                            year: "numeric",
                        }).format(new Date())}
                    </p>
                </div>
            </div>

            {/* Welcome banner */}
            <div className="relative isolate overflow-hidden rounded-xl border border-[#dce7e2] bg-[#e5efeb]">
                {/* Decorative campus background */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('/images/dashboard-campus.png')",
                    }}
                />

                {/* Overlay to keep the banner text readable */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-[#edf5ef] via-[#edf5ef]/95 to-[#edf5ef]/70 lg:via-[#edf5ef]/60 lg:to-[#edf5ef]/75"
                />

                <div className="flex min-h-[260px] flex-col justify-between gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
                    {/* Main welcome message */}
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold leading-tight text-[#123c35] sm:text-4xl lg:text-5xl">
                            Take Control
                            <br />
                            of Your Tomorrow
                        </h2>

                        <p className="mt-3 text-base text-[#123c35] sm:text-lg">
                            Track. Plan. Save. Achieve.
                        </p>

                        {/* Link to the existing transaction page */}
                        <Link
                            href="/transactions"
                            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#23634f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#194c3c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23634f]"
                        >
                            <Plus
                                aria-hidden="true"
                                className="h-4 w-4"
                            />
                            Add Transaction
                        </Link>
                    </div>

                    {/* Supporting message */}
                    <div
                        className={`${quoteFont.className} w-full max-w-[230px] shrink-0 self-center text-center text-[#123c35] lg:-rotate-14 lg:translate-x-6`}
                    >
                        <p className="text-2xl leading-tight sm:text-2xl">
                            “ Small steps
                            <br />
                            today, bigger
                            <br />
                            opportunities
                            <br />
                            tomorrow.”
                        </p>

                        {/* Decorative underline */}
                        <div
                            aria-hidden="true"
                            className="mx-auto mt-3 h-3 w-28 -rotate-3 rounded-[50%] border-t-2 border-[#123c35]"
                        />
                    </div>
                </div>
            </div>

            {/* Dashboard summary cards will go here */}

            {/* Dashboard overview panels will go here */}
        </section>
    );
}