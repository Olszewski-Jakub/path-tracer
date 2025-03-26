import React from 'react';

interface StatusBarProps {
    isDark: boolean;
    currentStep: any;
    getStatusMessage: () => React.ReactNode;
    legendItems: Array<{
        label: string;
        color: string;
    }>;
}

const StatusBar: React.FC<StatusBarProps> = ({ isDark, currentStep, getStatusMessage, legendItems }) => {
    return (
        <div
            className={`px-4 py-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {currentStep
                            ? getStatusMessage()
                            : 'Click on the grid to create walls. Click Start to begin.'
                        }
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    {}
                    <div className="flex lg:hidden items-center space-x-1">
                        {legendItems.map((item) => (
                            <div key={item.label} className="flex items-center">
                                <div
                                    className={`w-3 h-3 ${item.color} rounded-full`}
                                    title={item.label}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;