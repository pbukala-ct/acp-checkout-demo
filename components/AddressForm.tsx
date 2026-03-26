'use client';

import { useState } from 'react';

export interface AddressData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lineOne: string;
  lineTwo: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Props {
  onSubmit: (data: AddressData) => void;
}

const REQUIRED: (keyof AddressData)[] = ['firstName', 'lastName', 'email', 'phone', 'lineOne', 'city', 'postalCode', 'country'];

const LABELS: Record<keyof AddressData, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  lineOne: 'Address line 1',
  lineTwo: 'Address line 2 (optional)',
  city: 'City',
  postalCode: 'Postcode',
  country: 'Country',
};

export function AddressForm({ onSubmit }: Props) {
  const [data, setData] = useState<AddressData>({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 's.jenkins@example.net',
    phone: '2125550123',
    lineOne: '75 State Street',
    lineTwo: 'Apt 4B',
    city: 'New York',
    postalCode: '10004',
    country: 'US',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddressData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof AddressData, string>> = {};
    for (const field of REQUIRED) {
      if (!data[field].trim()) {
        newErrors[field] = `${LABELS[field].replace(' (optional)', '')} is required`;
      }
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(data);
  }

  function field(key: keyof AddressData) {
    return (
      <div key={key}>
        <label className="block text-xs text-gray-400 mb-1">{LABELS[key]}</label>
        <input
          type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
          value={data[key]}
          onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
          className={`w-full bg-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 border ${
            errors[key] ? 'border-red-500' : 'border-gray-600'
          } focus:outline-none focus:border-yellow-400`}
        />
        {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-4 w-full max-w-md border border-gray-700">
      <p className="text-sm font-semibold text-gray-200 mb-3">Shipping Address</p>
      <div className="grid grid-cols-2 gap-3">
        {field('firstName')}
        {field('lastName')}
      </div>
      <div className="mt-3 space-y-3">
        {field('email')}
        {field('phone')}
        {field('lineOne')}
        {field('lineTwo')}
        <div className="grid grid-cols-2 gap-3">
          {field('city')}
          {field('postalCode')}
        </div>
        {field('country')}
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-[#FFC82B] hover:bg-yellow-300 text-[#1a1a1a] font-semibold text-sm py-2.5 rounded-lg transition-colors"
      >
        Confirm Address
      </button>
    </form>
  );
}
