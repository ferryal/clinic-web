import {
  IconChecklist,
  IconUserShield,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Anamnesis',
    label: '3',
    href: '/',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Authentication Sign in',
    label: '',
    href: '/sign-in',
    icon: <IconUserShield size={18} />,
  },
]
