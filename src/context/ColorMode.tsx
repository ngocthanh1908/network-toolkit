import { createContext, useContext } from 'react';

type ColorModeCtx = {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
};

export const ColorModeContext = createContext<ColorModeCtx>({
    toggleColorMode: () => { },
    mode: 'dark',
});

export function useColorMode() {
    return useContext(ColorModeContext);
}