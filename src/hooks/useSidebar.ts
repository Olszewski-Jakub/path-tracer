import { useState, useCallback } from 'react';

interface UseSidebarProps {
    initialOpen?: boolean;
}

interface UseSidebarReturn {
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
}

export const useSidebar = ({
                               initialOpen = true
                           }: UseSidebarProps = {}): UseSidebarReturn => {
    const [isOpen, setIsOpen] = useState<boolean>(initialOpen);

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        toggle,
        open,
        close
    };
};