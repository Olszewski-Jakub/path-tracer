
import { Visualizer } from "@/components/Visualizer";
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer, Header } from "@/components/UI/index";

export default function Home() {
    return (
        <ThemeProvider>
            <div className="dark:bg-gray-900 bg-white min-h-screen transition-colors duration-300 dark:text-white text-gray-800 flex flex-col">
                <Header />

                <main className="container mx-auto p-4 flex-grow">
                    <Visualizer />
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}