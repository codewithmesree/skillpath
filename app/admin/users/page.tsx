"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/Card";
import { Search, UserCheck, UserMinus, ShieldAlert } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-bg-offwhite flex items-center justify-center font-heading font-bold uppercase opacity-20 text-4xl">Loading Users...</div>

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col font-body">
      <Navbar />
      
      <div className="flex flex-1">
        <AdminSidebar activeItem="Users" />
        
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-deep-indigo uppercase">Student Management</h1>
            <p className="text-lg opacity-70">Monitor user activity and manage permissions.</p>
          </header>

          <div className="mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-indigo/40" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 border-3 border-deep-indigo focus:shadow-brutal focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card className="p-0 overflow-hidden border-3">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-secondary/50 border-b-3 border-deep-indigo font-heading font-bold text-deep-indigo uppercase text-sm">
                     <tr>
                       <th className="p-4">User</th>
                       <th className="p-4">Role</th>
                       <th className="p-4">Joined On</th>
                       <th className="p-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="font-body text-deep-indigo">
                     {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                       <tr key={user._id} className="border-b-2 border-deep-indigo/5 hover:bg-secondary/10 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-lg">{user.name}</div>
                                <div className="text-sm opacity-50">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 border-2 font-bold text-[10px] uppercase tracking-widest ${
                              user.role === 'admin' 
                              ? 'bg-warning/20 border-warning text-warning' 
                              : 'bg-primary/10 border-primary/30 text-primary'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 opacity-70">
                            {new Date(user.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-4 text-right">
                             <div className="flex justify-end gap-2">
                               <button className="p-2 border-2 border-deep-indigo hover:bg-secondary transition-all" title="View Progress">
                                 <UserCheck size={16} />
                               </button>
                               <button className="p-2 border-2 border-error text-error hover:bg-error hover:text-white transition-all" title="Suspend">
                                 <UserMinus size={16} />
                               </button>
                             </div>
                          </td>
                       </tr>
                     )) : (
                       <tr>
                          <td colSpan={4} className="p-20 text-center font-heading font-bold opacity-20 text-2xl uppercase tracking-widest">No users found.</td>
                       </tr>
                     )}
                  </tbody>
               </table>
             </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
