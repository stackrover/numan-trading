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
        <header className="h-20 flex items-center glass sticky top-0 z-30 border-b border-slate-200/50 px-8">
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            {leftContent}
                            <div className="h-6 w-[1px] bg-slate-200 hidden md:block mx-2"></div>
                            <div className="hidden lg:flex items-center gap-2 text-slate-400">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">Admin</span>
                                <Icon icon="solar:alt-arrow-right-linear" className="text-xs" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Dashboard</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Mockup */}
                        <div className="hidden md:flex items-center gap-3 px-4 h-11 rounded-2xl bg-slate-100/50 border border-slate-200/50 text-slate-400 w-64 group hover:bg-white hover:border-orange-200 transition-all cursor-text focus-within:ring-2 focus-within:ring-orange-500/10">
                            <Icon icon="solar:magnifer-linear" className="text-lg group-hover:text-orange-500 transition-colors" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Search Intel...</span>
                            <div className="ml-auto flex items-center gap-1">
                                <kbd className="text-[9px] font-black bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-500">⌘</kbd>
                                <kbd className="text-[9px] font-black bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-500">K</kbd>
                            </div>
                        </div>

                        {/* Notifications Mockup */}
                        <button className="size-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:border-orange-100 transition-all relative group">
                            <Icon icon="solar:bell-bing-bold" className="text-xl group-hover:scale-110 transition-transform" />
                            <span className="absolute top-3 right-3 size-2 rounded-full bg-orange-500 border-2 border-white ring-4 ring-orange-500/5 animte-pulse"></span>
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

                        {rightContent || (
                            <Button className="bg-slate-950 hover:bg-slate-800 text-white font-black h-11 px-6 rounded-2xl border border-slate-800 transition-all flex items-center gap-2 uppercase text-[11px] tracking-widest group">
                                <Icon icon="solar:globus-bold" className="text-lg text-orange-400 group-hover:rotate-12 transition-transform" />
                                <span>Visit Public Site</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
