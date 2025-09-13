"use client"
import React, { useState } from "react";
import {
  Monitor,
  Thermometer,
  Zap,
  Wifi,
  Volume2,
  Battery,
  HardDrive,
  Cpu,
  ArrowLeft,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Lightbulb,
  Users,
  TrendingUp,
  Clock, // <- now correctly separated by a comma
} from "lucide-react";


interface CommonIssue {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  frequency: number; // percentage of users affected
  icon: React.ReactNode;
  category: string;
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
  solutions: string[];
  preventionTips: string[];
}

export default function CommonIssuesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedIssue, setSelectedIssue] = useState<CommonIssue | null>(null);

    const commonIssues: CommonIssue[] = [
        {
            id: 1,
            title: "Laptop Overheating",
            description: "Laptop gets very hot during use, causing performance issues or unexpected shutdowns",
            severity: "high",
            frequency: 78,
            icon: <Thermometer className="w-6 h-6" />,
            category: "Hardware",
            estimatedTime: "15-30 minutes",
            difficulty: "easy",
            solutions: [
                "Clean internal cooling fans and vents using compressed air",
                "Use laptop on hard, flat surfaces for better airflow",
                "Apply new thermal paste to CPU/GPU",
                "Use a laptop cooling pad"
            ],
            preventionTips: [
                "Regular cleaning every 3-6 months",
                "Avoid using on soft surfaces like beds",
                "Monitor CPU usage and close unnecessary programs"
            ]
        },
        {
            id: 2,
            title: "Laptop Won't Turn On",
            description: "Laptop appears completely dead with no lights or response when power button is pressed",
            severity: "high",
            frequency: 65,
            icon: <Zap className="w-6 h-6" />,
            category: "Power",
            estimatedTime: "10-20 minutes",
            difficulty: "easy",
            solutions: [
                "Check power adapter connection and try different outlet",
                "Remove battery and hold power button for 30 seconds",
                "Try powering on with just AC adapter (no battery)",
                "Check for damaged power adapter cable"
            ],
            preventionTips: [
                "Use original manufacturer charger",
                "Avoid overcharging the battery",
                "Store in dry, cool environment"
            ]
        },
        {
            id: 3,
            title: "Slow Performance",
            description: "Laptop runs sluggishly, takes long to boot up, or applications freeze frequently",
            severity: "medium",
            frequency: 89,
            icon: <Cpu className="w-6 h-6" />,
            category: "Performance",
            estimatedTime: "30-60 minutes",
            difficulty: "medium",
            solutions: [
                "Run disk cleanup and defragmentation",
                "Uninstall unused programs and disable startup items",
                "Scan for malware and viruses",
                "Add more RAM or upgrade to SSD",
                "Update drivers and operating system"
            ],
            preventionTips: [
                "Regular system maintenance",
                "Keep 15% of disk space free",
                "Use reputable antivirus software"
            ]
        },
        {
            id: 4,
            title: "Wi-Fi Connection Issues",
            description: "Cannot connect to Wi-Fi networks or frequent disconnections during use",
            severity: "medium",
            frequency: 72,
            icon: <Wifi className="w-6 h-6" />,
            category: "Network",
            estimatedTime: "15-25 minutes",
            difficulty: "easy",
            solutions: [
                "Restart router and laptop",
                "Update Wi-Fi drivers",
                "Forget and reconnect to network",
                "Reset network settings",
                "Check for interference from other devices"
            ],
            preventionTips: [
                "Keep drivers updated",
                "Position laptop closer to router",
                "Avoid interference from microwaves/phones"
            ]
        },
        {
            id: 5,
            title: "Battery Not Charging",
            description: "Battery percentage doesn't increase when plugged in or drains very quickly",
            severity: "medium",
            frequency: 56,
            icon: <Battery className="w-6 h-6" />,
            category: "Power",
            estimatedTime: "20-40 minutes",
            difficulty: "medium",
            solutions: [
                "Calibrate battery by full discharge and charge",
                "Update battery drivers",
                "Check power adapter wattage compatibility",
                "Replace aged battery (3+ years old)",
                "Clean battery contacts"
            ],
            preventionTips: [
                "Avoid letting battery drain to 0%",
                "Store at 50% charge if unused long-term",
                "Use power-saving modes"
            ]
        },
        {
            id: 6,
            title: "Blue Screen of Death (BSOD)",
            description: "System crashes with blue screen showing error codes and automatic restart",
            severity: "high",
            frequency: 34,
            icon: <AlertTriangle className="w-6 h-6" />,
            category: "System",
            estimatedTime: "45-90 minutes",
            difficulty: "hard",
            solutions: [
                "Boot into Safe Mode and identify recent changes",
                "Run memory diagnostic test",
                "Update or rollback recent drivers",
                "Check hard drive for errors",
                "Scan for malware",
                "Restore to previous system state"
            ],
            preventionTips: [
                "Keep system and drivers updated",
                "Regular hardware diagnostics",
                "Avoid overclocking hardware"
            ]
        },
        {
            id: 7,
            title: "No Audio/Sound Issues",
            description: "No sound from speakers or headphones, or audio quality problems",
            severity: "low",
            frequency: 41,
            icon: <Volume2 className="w-6 h-6" />,
            category: "Audio",
            estimatedTime: "10-20 minutes",
            difficulty: "easy",
            solutions: [
                "Check volume levels and mute settings",
                "Update audio drivers",
                "Run Windows audio troubleshooter",
                "Check default audio device settings",
                "Restart Windows audio service"
            ],
            preventionTips: [
                "Keep audio drivers updated",
                "Avoid sudden volume changes",
                "Use quality headphones/speakers"
            ]
        },
        {
            id: 8,
            title: "Hard Drive Failure",
            description: "Unusual clicking sounds, frequent crashes, or files becoming corrupted",
            severity: "high",
            frequency: 23,
            icon: <HardDrive className="w-6 h-6" />,
            category: "Hardware",
            estimatedTime: "2-4 hours",
            difficulty: "hard",
            solutions: [
                "Immediately backup important data",
                "Run disk check utility (chkdsk)",
                "Check SMART status of drive",
                "Replace hard drive if failing",
                "Consider upgrading to SSD"
            ],
            preventionTips: [
                "Regular backups to external storage",
                "Monitor drive health monthly",
                "Avoid physical shocks to laptop"
            ]
        }
    ];

    const categories = ["all", "Hardware", "Power", "Performance", "Network", "System", "Audio"];

    const filteredIssues = commonIssues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    
        const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory;
    
        return matchesSearch && matchesCategory;
    });

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case "high":
                return { color: "bg-red-100 text-red-800 border-red-300", icon: "🔴" };
            case "medium":
                return { color: "bg-amber-100 text-amber-800 border-amber-300", icon: "🟡" };
            case "low":
                return { color: "bg-green-100 text-green-800 border-green-300", icon: "🟢" };
            default:
                return { color: "bg-gray-100 text-gray-800 border-gray-300", icon: "⚪" };
        }
    };

    const getDifficultyConfig = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return { color: "bg-green-100 text-green-800", label: "Easy Fix" };
            case "medium":
                return { color: "bg-amber-100 text-amber-800", label: "Moderate" };
            case "hard":
                return { color: "bg-red-100 text-red-800", label: "Advanced" };
            default:
                return { color: "bg-gray-100 text-gray-800", label: "Unknown" };
        }
    };

    if (selectedIssue) {
        const severity = getSeverityConfig(selectedIssue.severity);
        const difficulty = getDifficultyConfig(selectedIssue.difficulty);

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white">
                <div className="max-w-4xl mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSelectedIssue(null)}
                                className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#2218DE" }}>
                                    <Monitor className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Laptop Medic</h1>
                                    <p className="text-gray-600 text-sm">Issue Details</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issue Detail Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: "#2218DE" }}>
                                    {selectedIssue.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${severity.color}`}>
                                            {severity.icon} {selectedIssue.severity.toUpperCase()} PRIORITY
                                        </span>
                                        <span className="text-sm text-gray-500">•</span>
                                        <span className="text-sm text-gray-600">{selectedIssue.frequency}% of users affected</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedIssue.title}</h2>
                                    <p className="text-gray-600 text-lg">{selectedIssue.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5" style={{ color: "#2218DE" }} />
                                    <div>
                                        <p className="text-sm text-gray-600">Estimated Time</p>
                                        <p className="font-semibold text-gray-800">{selectedIssue.estimatedTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Lightbulb className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Difficulty</p>
                                        <p className="font-semibold text-gray-800">{difficulty.label}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Success Rate</p>
                                        <p className="font-semibold text-gray-800">94%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Solutions */}
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
                                Solution Steps
                            </h3>
                            <div className="space-y-3">
                                {selectedIssue.solutions.map((solution, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: "#2218DE" }}>
                                            {index + 1}
                                        </span>
                                        <p className="text-gray-700 leading-relaxed">{solution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Prevention Tips */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Lightbulb className="w-6 h-6 mr-3 text-amber-500" />
                                Prevention Tips
                            </h3>
                            <div className="space-y-2">
                                {selectedIssue.preventionTips.map((tip, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#2218DE" }}></span>
                                        <p className="text-gray-700">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button className="flex-1 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg" style={{ backgroundColor: "#2218DE" }}>
                            Start Guided Diagnosis
                        </button>
                        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                            Contact Expert
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white">
            <div className="max-w-7xl mx-auto py-8 px-4">
             

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search common issues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
            
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                            ? 'text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    style={{
                                        backgroundColor: selectedCategory === category ? '#2218DE' : ''
                                    }}
                                >
                                    {category === "all" ? "All Categories" : category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#2218DE20" }}>
                                <BookOpen className="w-5 h-5" style={{ color: "#2218DE" }} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Issues</p>
                                <p className="text-xl font-bold text-gray-800">{commonIssues.length}</p>
                            </div>
                        </div>
                    </div>
          
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">High Priority</p>
                                <p className="text-xl font-bold text-gray-800">{commonIssues.filter(i => i.severity === "high").length}</p>
                            </div>
                        </div>
                    </div>
          
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Easy Fixes</p>
                                <p className="text-xl font-bold text-gray-800">{commonIssues.filter(i => i.difficulty === "easy").length}</p>
                            </div>
                        </div>
                    </div>
          
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Avg. Affected</p>
                                <p className="text-xl font-bold text-gray-800">{Math.round(commonIssues.reduce((sum, issue) => sum + issue.frequency, 0) / commonIssues.length)}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Issues Grid */}
                {filteredIssues.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#2218DE20" }}>
                            <Search className="w-10 h-10" style={{ color: "#2218DE" }} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Issues Found</h2>
                        <p className="text-gray-600 mb-6">
                            No issues match your current search or filter criteria. Try adjusting your search terms.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIssues.map((issue) => {
                            const severity = getSeverityConfig(issue.severity);
                            const difficulty = getDifficultyConfig(issue.difficulty);
              
                            return (
                                <div
                                    key={issue.id}
                                    onClick={() => setSelectedIssue(issue)}
                                    className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-full" style={{ backgroundColor: "#2218DE20" }}>
                                            <div style={{ color: "#2218DE" }}>
                                                {issue.icon}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                  
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{issue.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>
                  
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${severity.color}`}>
                                            {severity.icon} {issue.severity}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.color}`}>
                                            {difficulty.label}
                                        </span>
                                    </div>
                  
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>{issue.frequency}% affected</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{issue.estimatedTime}</span>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}