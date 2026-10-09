import{Bell, ChevronDown, Search} from "lucide-react";

export default function TopBar(){
    return(
        <header className ="sticky top 0 z-30 flex h-[68px] w-full items-center gap-6 border-b border-[#dce7e2] bg-white px-6">
           {/*Search field*/}
            <div className="w-full max-w-[540px] flex-1">
               <label className="relative block">
                <span className="sr-only">Search Finora</span>

                <Search
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#385536d]"/>

                    <input
                    type="search"
                    placeholder="Search transactions, categories, or goals..."
                    className="h-10 w-full rounded-lg border border-[#dce3e7] bg-[#f8fafb] pl-10 pr-4 text-sm text-[#17324d] outline-none 
                    placeholder:text-[#687b8e] focus:border-[#3f8068] focus:ring-2 focus:ring-[#3f8068]/20"/>
                </label> 
            </div>
            {/*Bell icon and profile area */}
            <div className="ml-auto flex shrink-0 items-center gap*5">
                <button
                    type="button"
                    arial-label="Notification"
                    className="relative rounded-lg p-2 text-[#17324d] hover:bg-[#f3f7f5]">

                <Bell aria-hidden="true" className="h-6 w-6"/>

                <span 
                aria-hidden="true"
                className="absolute right-1 top-1 h-2.5 w-2.5 rounder-full bg-[#e6346] ring-2 ring-white"/>
                </button>

                <button 
                type="button"
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-[#f3f2f5]">
                
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3f8068] text-sm font-semibold text-white">
                    SD
                </span>

                <span className="hidden sm:block">
                    <span className="block text-sm text-[#687b8e]">
                        Welcome back,
                    </span>
                    <span className="block text-base font medium text-[#17324d]">
                        Steven
                    </span>
                </span>

                <ChevronDown
                aria-hidden="true"
                className="hidden h-4 w-4 text=[#17324d] sm:block"/>
                </button>
            </div>
        </header>
    );
}