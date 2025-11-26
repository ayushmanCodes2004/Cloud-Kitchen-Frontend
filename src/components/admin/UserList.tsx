import { UserResponse } from '@/services/adminApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface UserListProps {
  users: UserResponse[];
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onVerify?: (id: number) => void;
  type: 'all' | 'chefs';
}

export const UserList = ({ users, onActivate, onDeactivate, onVerify, type }: UserListProps) => {
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  return (
    <div className="rounded-lg border-0 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Role</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6 font-medium text-gray-900">{user.name}</td>
                <td className="py-3 px-6 text-gray-600">{user.email}</td>
                <td className="py-3 px-6">
                  <Badge variant={user.role === 'CHEF' ? 'default' : 'secondary'} className="font-medium">
                    {user.role.toLowerCase()}
                  </Badge>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <Badge variant={user.active ? 'default' : 'destructive'} className="font-medium">
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                    {type === 'chefs' && (
                      <Badge variant={user.verified ? 'default' : 'secondary'} className="font-medium">
                        {user.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-6 text-right">
                  <div className="space-x-2">
                    {user.role === 'ADMIN' ? (
                      <Badge variant="secondary" className="px-3 py-1">
                        Protected
                      </Badge>
                    ) : user.active ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeactivate(user.id)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onActivate(user.id)}
                      >
                        Activate
                      </Button>
                    )}
                    {type === 'chefs' && onVerify && (
                      <Button
                        variant={user.verified ? "default" : "outline"}
                        size="sm"
                        disabled={verifyingId === user.id}
                        onClick={async () => {
                          setVerifyingId(user.id);
                          try {
                            await onVerify(user.id);
                          } finally {
                            setVerifyingId(null);
                          }
                        }}
                      >
                        {verifyingId === user.id 
                          ? 'Processing...' 
                          : user.verified 
                            ? 'Unverify' 
                            : 'Verify'}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};