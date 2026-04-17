import { Visualizer } from "@/components/Visualizer";
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer, Header } from "@/components/UI/index";

export default function Home() {
    return (
        <ThemeProvider>
            <div
                className="min-h-screen flex flex-col transition-colors duration-300"
                style={{ background: 'var(--background)', color: 'var(--foreground)' }}
            >
                <Header />
                <main className="flex-grow">
                    <Visualizer />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}
