'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { DataTable } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/modal';
import { AdvancedSearch } from '@/components/ui/advanced-search';
import { userData, AdminUser } from '../data';

export const UsersTab = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const userColumns: {
    key: keyof AdminUser;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, row: AdminUser) => React.ReactNode;
  }[] = [
    { key: 'name', label: 'Ime', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Uloga', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (value: unknown) => (
      <span className={`px-2 py-1 rounded text-xs ${
        value === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {String(value)}
      </span>
    )},
    { key: 'lastLogin', label: 'Poslednji login', sortable: true },
    { key: 'actions', label: 'Akcije', render: () => (
      <div className="flex space-x-2">
        <button className="p-1 text-blue-400 hover:text-blue-300">
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-1 text-green-400 hover:text-green-300">
          <Edit className="w-4 h-4" />
        </button>
        <button className="p-1 text-red-400 hover:text-red-300">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  const searchFilters = [
    {
      key: 'role',
      label: 'Uloga',
      type: 'select' as const,
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Moderator', label: 'Moderator' },
        { value: 'User', label: 'Korisnik' },
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Aktivan' },
        { value: 'inactive', label: 'Neaktivan' },
      ]
    }
  ];

  const handleSearch = (query: string, searchFilters: Record<string, unknown>) => {
    setSearchQuery(query);
    setFilters(searchFilters);
  };

  const filteredUsers = useMemo(() => {
    return userData.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filters['role'] || user.role === filters['role']) &&
      (!filters['status'] || user.status === filters['status'])
    );
  }, [searchQuery, filters]);

  const handleUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <motion.div
      key="users"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <InteractiveCard
        title="Upravljanje Korisnicima"
        description="Pregled i upravljanje svim korisnicima platforme"
        className="p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <AdvancedSearch
              onSearch={handleSearch}
              placeholder="Pretraži korisnike..."
              filters={searchFilters}
              className="flex-1 max-w-md"
            />
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Dodaj korisnika</span>
            </button>
          </div>

          <DataTable
            data={filteredUsers}
            columns={userColumns}
            onRowClick={handleUserClick}
            emptyMessage="Nema korisnika koji odgovaraju kriterijumima pretrage"
          />
        </div>
      </InteractiveCard>

      {/* User Detail Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={selectedUser?.name || ''}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Osnovne informacije</h4>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-medium">Uloga:</span> {selectedUser.role}</p>
                  <p><span className="font-medium">Status:</span> {selectedUser.status}</p>
                  <p><span className="font-medium">Poslednji login:</span> {selectedUser.lastLogin}</p>
                  <p><span className="font-medium">Datum registracije:</span> {selectedUser.joinDate}</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Akcije</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Ažuriraj profil
                  </button>
                  <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                    Promeni ulogu
                  </button>
                  <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Deaktiviraj korisnika
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};
