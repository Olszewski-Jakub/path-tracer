import { useTheme } from '@/components/ThemeProvider';

interface UseThemeReturn {
    theme: string;
    isDark: boolean;
}

export const useThemeMode = (): UseThemeReturn => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return {
        theme,
        isDark
    };
};