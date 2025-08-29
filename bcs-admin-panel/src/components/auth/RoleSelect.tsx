
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Role = {
  id: string;
  label: string;
};

const roles: Role[] = [
  { id: 'cashier', label: 'BCS Cashier' },
  { id: 'admin', label: 'BCS Admin' },
  { id: 'assistant', label: 'BCS Admin Assistant' },
  { id: 'dispatcher', label: 'BCS Terminal Operator' },
];

interface RoleSelectProps {
  selectedRole: string | null;
  onRoleSelect: (role: string) => void;
}

const RoleSelect = ({ selectedRole, onRoleSelect }: RoleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRoleSelect = (roleId: string) => {
    onRoleSelect(roleId);
    setIsOpen(false);
  };

  const selectedRoleLabel = selectedRole 
    ? roles.find(role => role.id === selectedRole)?.label 
    : 'Select Account';

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none"
      >
        <span className="text-gray-700">{selectedRoleLabel}</span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1">
            {roles.map((role) => (
              <li
                key={role.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={() => handleRoleSelect(role.id)}
              >
                {role.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoleSelect;
