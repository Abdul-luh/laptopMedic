"use client"
import React, { useState, useEffect } from "react";
import {
  Clock,
  Monitor,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

// Mock data structure matching your actual data
interface DiagnosisStep {
  id: number;
  step_number: number;
  instruction: string;
  completed: boolean;
}

interface HistoryItem {
  id: number;
  laptop_brand: string;
  laptop_model: string;
  description: string;
  created_at: string;
  solved: boolean;
  steps: DiagnosisStep[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "solved" | "pending"
  >("all");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mock data for demo
  const mockHistory: HistoryItem[] = [
    {
      id: 18,
      laptop_brand: "Dell",
      laptop_model: "XPS 15",
      description: "goes off abruptly",
      created_at: "2025-09-11T03:33:49.438967",
      solved: false,
      steps: Array(26)
        .fill(null)
        .map((_, i) => ({
          id: 217 + i,
          step_number: i + 1,
          instruction: `Step ${i + 1} instruction`,
          completed: Math.random() > 0.7,
        })),
    },
    {
      id: 17,
      laptop_brand: "HP",
      laptop_model: "Pavilion 14",
      description: "overheating",
      created_at: "2025-06-01T10:20:30.123456",
      solved: true,
      steps: Array(12)
        .fill(null)
        .map((_, i) => ({
          id: 300 + i,
          step_number: i + 1,
          instruction: `Cooling step ${i + 1}`,
          completed: true,
        })),
    },
    {
      id: 16,
      laptop_brand: "Lenovo",
      laptop_model: "ThinkPad X1",
      description: "slow performance",
      created_at: "2025-07-08T14:15:22.987654",
      solved: false,
      steps: Array(8)
        .fill(null)
        .map((_, i) => ({
          id: 400 + i,
          step_number: i + 1,
          instruction: `Performance step ${i + 1}`,
          completed: i < 4,
        })),
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHistory(mockHistory);
      setLoading(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCompletionPercentage = (steps: DiagnosisStep[]) => {
    const completed = steps.filter((step) => step.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  const getDifficultyInfo = (stepsCount: number) => {
    if (stepsCount <= 5)
      return {
        level: "Easy",
        color: "bg-green-100 text-green-800",
        icon: "🟢",
      };
    if (stepsCount <= 15)
      return {
        level: "Medium",
        color: "bg-amber-100 text-amber-800",
        icon: "🟡",
      };
    return { level: "Hard", color: "bg-red-100 text-red-800", icon: "🔴" };
  };

  const getStatusIcon = (solved: boolean, percentage: number) => {
    if (solved) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (percentage > 0) return <Clock className="w-5 h-5 text-amber-500" />;
    return <XCircle className="w-5 h-5 text-gray-400" />;
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.laptop_brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.laptop_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "solved" && item.solved) ||
      (filterStatus === "pending" && !item.solved);

    return matchesSearch && matchesFilter;
  });

  const toggleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedItems.size > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    setHistory((prev) => prev.filter((item) => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
            style={{ backgroundColor: "#2218DE" }}
          >
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading History...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your diagnosis history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#2218DE" }}
              >
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Laptop Medic
                </h1>
                <p className="text-gray-600 text-sm">Diagnosis History</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <span
              className="cursor-pointer transition-colors"
              style={{ color: "#2218DE" }}
            >
              Home
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Diagnose
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Contact
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Account
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand, model, or issue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2218DE] transition-colors"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as "all" | "solved" | "pending"
                    )
                  }
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2218DE] transition-colors appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="solved">Resolved</option>
                  <option value="pending">In Progress</option>
                </select>
              </div>

              <button
                onClick={loadHistory}
                className="p-3 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-md"
                style={{ backgroundColor: "#2218DE" }}
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {selectedItems.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-md"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#2218DE20" }}
              >
                <Calendar className="w-5 h-5" style={{ color: "#2218DE" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Diagnoses</p>
                <p className="text-xl font-bold text-gray-800">
                  {history.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-xl font-bold text-gray-800">
                  {history.filter((h) => h.solved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-xl font-bold text-gray-800">
                  {history.filter((h) => !h.solved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-bold text-gray-800">
                  {
                    history.filter(
                      (h) =>
                        new Date(h.created_at).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#2218DE20" }}
            >
              <Clock className="w-10 h-10" style={{ color: "#2218DE" }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Diagnosis History Found
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterStatus !== "all"
                ? "No diagnoses match your current search or filter criteria. Try adjusting your search terms."
                : "Start your first diagnosis to see your history here. We'll keep track of all your laptop troubleshooting sessions."}
            </p>
            <button
              className="text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: "#2218DE" }}
            >
              Start New Diagnosis
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const completion = getCompletionPercentage(item.steps);
              const difficulty = getDifficultyInfo(item.steps.length);
              const isSelected = selectedItems.has(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
                    isSelected ? "ring-2 ring-blue-200" : "border-gray-200"
                  }`}
                  style={{
                    borderColor: isSelected ? "#2218DE" : "",
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="mt-1 w-4 h-4 rounded border-gray-300 focus:ring-2"
                          style={{ accentColor: "#2218DE" }}
                        />

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(item.solved, completion)}
                            <h3 className="text-xl font-bold text-gray-800">
                              {item.laptop_brand} {item.laptop_model}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${difficulty.color}`}
                            >
                              {difficulty.icon} {difficulty.level}
                            </span>
                          </div>

                          <p className="text-gray-600 capitalize mb-3">
                            Issue: {item.description}
                          </p>

                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(item.created_at)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(item.created_at)}</span>
                            </span>
                            <span>{item.steps.length} steps total</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progress: {completion}%
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.solved
                              ? "bg-green-100 text-green-800"
                              : completion > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.solved
                            ? "Completed"
                            : completion > 0
                            ? "In Progress"
                            : "Not Started"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${completion}%`,
                            background: item.solved
                              ? "linear-gradient(90deg, #10B981, #059669)"
                              : `linear-gradient(90deg, #2218DE, #6B46C1)`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete {selectedItems.size} selected
                  diagnosis(es)? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
