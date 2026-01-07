import React from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify-icon/react";

const NavbarContext = React.createContext();

export const useNavbar = () => {
    const context = React.useContext(NavbarContext);
    if (!context) {
        throw new Error("useNavbar must be used within a NavbarProvider");
    }
    return context;
};

export const NavbarProvider = ({ children }) => {
    const [leftContent, setLeftContent] = React.useState(null);
    const [rightContent, setRightContent] = React.useState(null);

    const value = React.useMemo(
        () => ({
            leftContent,
            rightContent,
        }),
        [leftContent, rightContent],
    );

    return (
        <NavbarContext.Provider
            value={{ ...value, setLeftContent, setRightContent }}
        >
            {children}
        </NavbarContext.Provider>
    );
};

export const Navbar = () => {
    const { leftContent, rightContent } = useNavbar();

    return (
        <header className="h-20 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 px-6 sm:px-8">
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            {leftContent}
                            <div className="h-6 w-[1px] bg-slate-200 hidden md:block mx-1"></div>
                            <div className="hidden lg:flex items-center gap-2 text-slate-400">
                                <Icon icon="solar:home-2-linear" className="text-lg" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Main Control</span>
                                <Icon icon="solar:alt-arrow-right-linear" className="text-xs" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900">Current Node</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Simple Search */}
                        <div className="hidden md:flex items-center gap-2 px-3 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 w-64 group hover:bg-white transition-all cursor-text focus-within:ring-2 focus-within:ring-indigo-500/10">
                            <Icon icon="solar:magnifer-linear" className="text-lg" />
                            <span className="text-sm font-medium">Search records...</span>
                        </div>

                        {/* Notifications */}
                        <button className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all relative">
                            <Icon icon="solar:bell-linear" className="text-xl" />
                            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-indigo-600 border-2 border-white"></span>
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

                        {rightContent || (
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-xl border border-slate-800 shadow-sm transition-all flex items-center gap-2 text-xs uppercase tracking-wider">
                                <Icon icon="solar:globus-linear" className="text-lg" />
                                <span>Visit Website</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
