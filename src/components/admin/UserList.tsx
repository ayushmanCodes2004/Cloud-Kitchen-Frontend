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
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Status</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="py-3">{user.name}</td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">
                  <Badge variant={user.role === 'CHEF' ? 'default' : 'secondary'}>
                    {user.role.toLowerCase()}
                  </Badge>
                </td>
                <td className="py-3">
                  <Badge variant={user.active ? 'default' : 'destructive'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                  {type === 'chefs' && (
                    <Badge variant={user.verified ? 'default' : 'secondary'} className="ml-2">
                      {user.verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  )}
                </td>
                <td className="py-3 text-right">
                  <div className="space-x-2">
                    {user.active ? (
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
                    {type === 'chefs' && !user.verified && onVerify && (
                      <Button
                        variant="outline"
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
                        {verifyingId === user.id ? 'Verifying...' : 'Verify'}
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