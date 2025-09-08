"use client"
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <main className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Welcome, {user!.name}!</h2>

            {/* Admin-only section */}
            {user!.role === 'admin' && (
                <section className="mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow">
                        <h3 className="text-xl font-semibold text-blue-800 mb-2">Admin Panel</h3>
                        <p className="text-blue-700 mb-4">
                            Manage users, view diagnostics, and access advanced settings.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="/admin/users"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                            >
                                Manage Users
                            </a>
                            <a
                                href="/admin/diagnostics"
                                className="bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 font-medium"
                            >
                                Diagnostics
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* Rest of dashboard content */}
            <section>
                <h3 className="text-xl font-semibold mb-2">Your Recent Activity</h3>
                <ul className="list-disc pl-6 mb-6">
                    <li>Checked device status</li>
                    <li>Submitted a support ticket</li>
                    <li>Viewed diagnostics report</li>
                </ul>
                <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
                <div className="flex space-x-4">
                    <a
                        href="/support"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                    >
                        Contact Support
                    </a>
                    <a
                        href="/devices"
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 font-medium"
                    >
                        My Devices
                    </a>
                </div>
            </section>
        </main>
    );
}
