import React from 'react';

export interface ContractData {
  id: string;
  name: string;
  parties: string[];
  value: string;
  jurisdiction: string;
  expiryDate: string;
  status: 'analyzed' | 'pending' | 'risk';
  content: string;
}

export interface Risk {
  id: string;
  clause: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  page: number;
  highlightText: string;
  validated?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ExtractionBadge {
  label: string;
  value: string;
  icon: React.ReactNode;
}