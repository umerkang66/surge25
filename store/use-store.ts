import { create } from 'zustand';

interface State {
  role: 'FINDER' | 'SEEKER';
  toggleRole: () => void;
}

export const useStore = create<State>(set => ({
  role: 'SEEKER',
  toggleRole: () =>
    set(s => ({ role: s.role === 'SEEKER' ? 'FINDER' : 'SEEKER' })),
}));
