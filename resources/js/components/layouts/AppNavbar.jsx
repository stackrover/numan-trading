import React from "react";
import { Button } from "../ui/button";

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
        <header className="py-2 bg-sidebar border-b border-border">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {/* Left content can be added here */}
                    </div>
                    <div className="flex items-center">
                        {rightContent || (
                            <div className="flex items-center gap-x-2">
                                <Button> Visit Site </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
