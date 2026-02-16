# FinControl - Design System
## Sistema de Design para Gestão Financeira

**Versão:** 1.0.0  
**Data:** 16/02/2026  
**Status:** Draft

---

## 1. Identidade Visual

### 1.1 Filosofia de Design

O FinControl adota uma estética **"Financial Premium"** que transmite:
- **Confiança:** Cores sóbrias, tipografia clara, interface estável
- **Profissionalismo:** Design limpo, organizado, sem distrações
- **Modernidade:** Glassmorphism sutil, micro-animações, interações fluidas
- **Acessibilidade:** Alto contraste, foco em legibilidade, suporte a temas

### 1.2 Paleta de Cores

#### Cores Primárias
```css
/* Primary - Azul Financeiro */
--primary-50:  #EFF6FF;
--primary-100: #DBEAFE;
--primary-200: #BFDBFE;
--primary-300: #93C5FD;
--primary-400: #60A5FA;
--primary-500: #3B82F6;  /* Principal */
--primary-600: #2563EB;
--primary-700: #1D4ED8;
--primary-800: #1E40AF;
--primary-900: #1E3A8A;
--primary-950: #172554;

/* Secondary - Roxo Premium */
--secondary-50:  #FAF5FF;
--secondary-100: #F3E8FF;
--secondary-200: #E9D5FF;
--secondary-300: #D8B4FE;
--secondary-400: #C084FC;
--secondary-500: #A855F7;
--secondary-600: #9333EA;
--secondary-700: #7C3AED;
--secondary-800: #6B21A8;
--secondary-900: #581C87;
--secondary-950: #3B0764;
```

#### Cores de Semântica Financeira
```css
/* Success - Verde (Receitas) */
--success-50:  #F0FDF4;
--success-100: #DCFCE7;
--success-200: #BBF7D0;
--success-500: #22C55E;
--success-600: #16A34A;
--success-700: #15803D;

/* Danger - Vermelho (Despesas) */
--danger-50:  #FEF2F2;
--danger-100: #FEE2E2;
--danger-200: #FECACA;
--danger-500: #EF4444;
--danger-600: #DC2626;
--danger-700: #B91C1C;

/* Warning - Âmbar (Alertas) */
--warning-50:  #FFFBEB;
--warning-100: #FEF3C7;
--warning-200: #FDE68A;
--warning-500: #F59E0B;
--warning-600: #D97706;
--warning-700: #B45309;

/* Info - Ciano (Informações) */
--info-50:  #ECFEFF;
--info-100: #CFFAFE;
--info-200: #A5F3FC;
--info-500: #06B6D4;
--info-600: #0891B2;
--info-700: #0E7490;
```

#### Cores Neutras (Gray Scale)
```css
--gray-50:  #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
--gray-950: #030712;
```

#### Cores de Superfície (Dark Mode)
```css
/* Background */
--bg-primary:   #0F172A;    /* Slate 900 */
--bg-secondary: #1E293B;    /* Slate 800 */
--bg-tertiary:  #334155;    /* Slate 700 */
--bg-elevated:  #1E293B;    /* Cards, modals */

/* Text */
--text-primary:   #F8FAFC;   /* Slate 50 */
--text-secondary: #94A3B8;  /* Slate 400 */
--text-tertiary:  #64748B;  /* Slate 500 */
--text-disabled:  #475569;  /* Slate 600 */

/* Borders */
--border-light:   #334155;   /* Slate 700 */
--border-medium:  #475569;   /* Slate 600 */
--border-focus:   #3B82F6;   /* Primary 500 */
```

### 1.3 Efeitos Visuais Premium

#### Glassmorphism
```css
/* Glass Card */
.glass-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

/* Glass Modal */
.glass-modal {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
}
```

#### Glow Effects
```css
/* Primary Glow */
.glow-primary {
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.3),
    0 0 40px rgba(59, 130, 246, 0.1);
}

/* Success Glow (Receitas) */
.glow-success {
  box-shadow: 
    0 0 20px rgba(34, 197, 94, 0.3),
    0 0 40px rgba(34, 197, 94, 0.1);
}

/* Danger Glow (Despesas) */
.glow-danger {
  box-shadow: 
    0 0 20px rgba(239, 68, 68, 0.3),
    0 0 40px rgba(239, 68, 68, 0.1);
}

/* Hover Glow */
.glow-hover:hover {
  box-shadow: 
    0 0 30px rgba(59, 130, 246, 0.4),
    0 0 60px rgba(59, 130, 246, 0.2);
  transition: box-shadow 0.3s ease;
}
```

#### Gradientes Dinâmicos
```css
/* Gradient Background */
.gradient-bg {
  background: linear-gradient(
    135deg,
    #0F172A 0%,
    #1E293B 50%,
    #0F172A 100%
  );
}

/* Gradient Accent (Cards Premium) */
.gradient-accent {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(168, 85, 247, 0.1) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(
    135deg,
    #3B82F6 0%,
    #A855F7 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animated Gradient Border */
@keyframes gradient-rotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-border {
  position: relative;
  background: #1E293B;
  border-radius: 16px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    45deg,
    #3B82F6,
    #A855F7,
    #3B82F6
  );
  background-size: 200% 200%;
  border-radius: 18px;
  z-index: -1;
  animation: gradient-rotate 3s ease infinite;
}
```

### 1.4 Tipografia

#### Font Family
```css
/* Font Stack */
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
--font-display: 'Inter', sans-serif;
```

#### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

#### Escala Tipográfica
```css
/* Display */
--text-display: 3rem;      /* 48px - H1 Hero */
--text-h1: 2.25rem;        /* 36px - Page Title */
--text-h2: 1.875rem;       /* 30px - Section Title */
--text-h3: 1.5rem;         /* 24px - Card Title */
--text-h4: 1.25rem;        /* 20px - Subsection */
--text-h5: 1.125rem;       /* 18px - Label Large */
--text-h6: 1rem;           /* 16px - Label */

/* Body */
--text-body: 1rem;         /* 16px */
--text-body-sm: 0.875rem;  /* 14px */
--text-body-xs: 0.75rem;   /* 12px */

/* Special */
--text-caption: 0.75rem;   /* 12px */
--text-overline: 0.625rem; /* 10px - All caps */
```

#### Pesos de Fonte
```css
--font-light:    300;
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

#### Altura de Linha
```css
--leading-none:    1;
--leading-tight:   1.25;
--leading-snug:    1.375;
--leading-normal:  1.5;
--leading-relaxed: 1.625;
--leading-loose:   2;
```

#### Tracking (Letter Spacing)
```css
--tracking-tighter: -0.05em;
--tracking-tight:   -0.025em;
--tracking-normal:  0;
--tracking-wide:    0.025em;
--tracking-wider:   0.05em;
--tracking-widest:  0.1em;
```

### 1.5 Grid & Espaçamento

#### Sistema de Grid
```css
/* Container */
--container-sm:   640px;
--container-md:   768px;
--container-lg:   1024px;
--container-xl:   1280px;
--container-2xl:  1536px;

/* Grid Columns */
--grid-cols: 12;
--grid-gap:  1.5rem; /* 24px */
```

#### Escala de Espaçamento (8px Base)
```css
--space-0:  0;       /* 0px */
--space-1:  0.25rem; /* 4px */
--space-2:  0.5rem;  /* 8px */
--space-3:  0.75rem; /* 12px */
--space-4:  1rem;    /* 16px */
--space-5:  1.25rem; /* 20px */
--space-6:  1.5rem;  /* 24px */
--space-8:  2rem;    /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

#### Border Radius
```css
--radius-none: 0;
--radius-sm:   0.25rem;  /* 4px */
--radius-md:   0.375rem; /* 6px */
--radius-lg:   0.5rem;   /* 8px */
--radius-xl:   0.75rem;  /* 12px */
--radius-2xl:  1rem;     /* 16px */
--radius-3xl:  1.5rem;   /* 24px */
--radius-full: 9999px;
```

#### Sombras (Box Shadow)
```css
/* Elevation System */
--shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);

/* Custom Shadows */
--shadow-card:      0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-dropdown:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-modal:     0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## 2. Componentes UI

### 2.1 Átomos (Atoms)

#### Button
```typescript
// types/Button.types.ts
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Estados Visuais:**
- **Default:** bg-primary-600, text-white, shadow-md
- **Hover:** scale(1.02), glow-primary, brightness(1.1)
- **Active:** scale(0.98), brightness(0.95)
- **Focus:** ring-2 ring-primary-400 ring-offset-2
- **Disabled:** opacity-50, cursor-not-allowed, no hover effects
- **Loading:** Spinner animation, disabled interactions

**Animações:**
```css
.btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.btn:active {
  transform: scale(0.98);
}
```

#### Input
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'currency' | 'date';
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
}
```

**Estados:**
- **Default:** border-gray-600, bg-bg-secondary
- **Hover:** border-primary-400
- **Focus:** border-primary-500, ring-2 ring-primary-500/20
- **Error:** border-danger-500, text-danger-500
- **Disabled:** opacity-50, bg-gray-800
- **Filled:** label animates up, border-primary-500

**Animações de Label (Floating Label):**
```css
.input-label {
  transition: all 0.2s ease;
  transform-origin: left top;
}

.input:focus + .input-label,
.input:not(:placeholder-shown) + .input-label {
  transform: translateY(-1.5rem) scale(0.85);
  color: var(--primary-400);
}
```

#### Badge
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}
```

**Variações:**
- **Default:** bg-gray-700, text-gray-200
- **Success:** bg-success-500/20, text-success-400, border-success-500/30
- **Danger:** bg-danger-500/20, text-danger-400, border-danger-500/30
- **Warning:** bg-warning-500/20, text-warning-400, border-warning-500/30
- **Info:** bg-info-500/20, text-info-400, border-info-500/30

---

### 2.2 Moléculas (Molecules)

#### Card
```typescript
interface CardProps {
  variant?: 'default' | 'glass' | 'gradient' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}
```

**Variações:**
- **Default:** bg-bg-secondary, rounded-2xl, shadow-lg
- **Glass:** glass-card class
- **Gradient:** gradient-accent class
- **Outlined:** border border-gray-700, bg-transparent

**Animações de Hover:**
```css
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

#### Transaction Item
```typescript
interface TransactionItemProps {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: { name: string; color: string; icon: string };
  date: Date;
  account: { name: string; type: AccountType };
  onClick?: () => void;
}
```

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Icon]  Description                    R$ 1.234,56 │
│ [Cat]   Category Name        Account  •  15 Fev    │
└─────────────────────────────────────────────────────┘
```

**Animações:**
```css
.transaction-item {
  transition: all 0.2s ease;
}

.transaction-item:hover {
  background: rgba(59, 130, 246, 0.05);
  transform: translateX(4px);
}

.transaction-amount {
  transition: color 0.3s ease;
}

.transaction-amount.income {
  color: var(--success-500);
  text-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.transaction-amount.expense {
  color: var(--danger-500);
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}
```

#### Balance Card
```typescript
interface BalanceCardProps {
  title: string;
  amount: number;
  currency: string;
  change?: { value: number; percentage: number };
  icon: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'neutral';
}
```

**Animações de Número (Count Up):**
```typescript
// hooks/useCountUp.ts
const useCountUp = (target: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(target * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);
  
  return count;
};
```

---

### 2.3 Organismos (Organisms)

#### Dashboard Header
```typescript
interface DashboardHeaderProps {
  workspaceName: string;
  user: User;
  totalBalance: number;
  notifications: Notification[];
}
```

**Animações de Entrada:**
```typescript
// Framer Motion variants
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};
```

#### Transaction List
```typescript
interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}
```

**Animações de Lista (Stagger):**
```typescript
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 }
  }
};

// Uso com AnimatePresence
<AnimatePresence mode="popLayout">
  {transactions.map((tx) => (
    <motion.div
      key={tx.id}
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <TransactionItem {...tx} />
    </motion.div>
  ))}
</AnimatePresence>
```

#### Chart Container
```typescript
interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  height?: number;
  loading?: boolean;
  empty?: boolean;
}
```

**Loading State:**
```typescript
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-48 bg-gray-700 rounded mb-4" />
    <div className="h-64 bg-gray-800 rounded-2xl">
      <div className="h-full w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer" />
    </div>
  </div>
);

// CSS shimmer animation
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  animation: shimmer 2s infinite;
}
```

---

### 2.4 Templates (Layouts)

#### App Layout
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
  header?: boolean;
}
```

**Estrutura:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  [Header: Logo | Search | Notifications | User]│
│            │────────────────────────────────────────────────│
│  Dashboard │                                                │
│  Accounts  │           [Main Content Area]                  │
│  Transactions                                             │
│  Budgets   │           • Dashboard widgets                  │
│  Goals     │           • Lists                             │
│  Reports   │           • Forms                             │
│  Settings  │           • Charts                            │
│            │                                                │
└─────────────────────────────────────────────────────────────┘
```

**Animações de Sidebar:**
```typescript
const sidebarVariants = {
  expanded: { width: 280 },
  collapsed: { width: 80 }
};

// Hover effect on nav items
const navItemVariants = {
  initial: { backgroundColor: 'transparent' },
  hover: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    x: 4,
    transition: { duration: 0.2 }
  },
  active: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderLeft: '3px solid #3B82F6'
  }
};
```

---

## 3. Animações (MANDATÓRIO)

### 3.1 Micro-interações

#### Hover Scale + Glow
```typescript
// components/animations/GlowButton.tsx
const GlowButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ 
      scale: 1.02,
      boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ 
      type: 'spring',
      stiffness: 400,
      damping: 17
    }}
    {...props}
  >
    {children}
  </motion.button>
);
```

#### Active Scale
```typescript
const PressableCard = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.1 }}
  >
    {children}
  </motion.div>
);
```

#### Focus Rings
```css
/* Tailwind custom focus */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-bg-primary;
  transition: box-shadow 0.2s ease;
}

/* ARIA focus visible */
.focus-ring:focus-visible {
  box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--primary-500);
}
```

### 3.2 Entrada de Elementos (Stagger Effects)

#### Fade + Slide Up
```typescript
// containers/AnimatedList.tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier
    }
  }
};

// Uso
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={itemVariants}
      custom={i}
    >
      <Card>{item.content}</Card>
    </motion.div>
  ))}
</motion.div>
```

#### Dashboard Widgets Entrance
```typescript
const dashboardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const widgetVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};
```

### 3.3 Transições de Página

#### AnimatePresence com Slide Suave
```typescript
// layouts/PageTransition.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { 
    opacity: 0, 
    x: 20 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2
    }
  }
};

export const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

### 3.4 Loading States

#### Skeletons Elegantes
```typescript
const SkeletonCard = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-xl bg-gray-700 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse" />
        <div className="h-3 bg-gray-800 rounded w-1/4 animate-pulse" />
      </div>
    </div>
    <div className="h-8 bg-gray-700 rounded w-2/3 animate-pulse" />
    <div className="h-3 bg-gray-800 rounded w-full animate-pulse" />
  </div>
);

// Shimmer effect
const ShimmerSkeleton = () => (
  <div className="relative overflow-hidden">
    <div className="h-20 bg-gray-800 rounded-xl" />
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
      animate={{
        x: ['-100%', '100%']
      }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }}
    />
  </div>
);
```

#### Spinners Animados
```typescript
const LoadingSpinner = ({ size = 24 }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" className="text-primary-500">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="45"
        strokeDashoffset="0"
      />
    </svg>
  </motion.div>
);

// Dots bounce
const LoadingDots = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-primary-500 rounded-full"
        animate={{
          y: [0, -6, 0]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15
        }}
      />
    ))}
  </div>
);
```

### 3.5 Feedback Visual

#### Success Animation (Checkmark)
```typescript
const SuccessCheckmark = () => (
  <motion.svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    initial="hidden"
    animate="visible"
  >
    <motion.circle
      cx="32"
      cy="32"
      r="28"
      fill="none"
      stroke="#22C55E"
      strokeWidth="3"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
          pathLength: 1,
          opacity: 1,
          transition: { duration: 0.5, ease: 'easeInOut' }
        }
      }}
    />
    <motion.path
      d="M20 32 L28 40 L44 24"
      fill="none"
      stroke="#22C55E"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
          pathLength: 1,
          opacity: 1,
          transition: { duration: 0.4, delay: 0.3, ease: 'easeInOut' }
        }
      }}
    />
  </motion.svg>
);
```

#### Error Animation (Shake)
```typescript
const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }
};

const ErrorMessage = ({ message }) => (
  <motion.div
    variants={shakeVariants}
    animate="shake"
    className="flex items-center space-x-2 text-danger-500 bg-danger-500/10 px-4 py-3 rounded-lg"
  >
    <AlertCircle size={20} />
    <span>{message}</span>
  </motion.div>
);
```

#### Toast Notifications
```typescript
const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    x: 100,
    transition: { duration: 0.2 }
  }
};

const Toast = ({ type, message, onClose }) => (
  <motion.div
    variants={toastVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    layout
    className={`
      flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg
      ${type === 'success' ? 'bg-success-500/20 border border-success-500/30' : ''}
      ${type === 'error' ? 'bg-danger-500/20 border border-danger-500/30' : ''}
    `}
  >
    {type === 'success' && <CheckCircle className="text-success-500" />}
    {type === 'error' && <XCircle className="text-danger-500" />}
    <span className="text-white">{message}</span>
    <button onClick={onClose} className="text-gray-400 hover:text-white">
      <X size={16} />
    </button>
  </motion.div>
);
```

### 3.6 Efeitos Premium

#### Parallax suave
```typescript
const ParallaxSection = ({ children }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  
  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  );
};
```

#### Mouse Following Glow
```typescript
const GlowCard = ({ children }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-2xl bg-gray-800"
    >
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          left: mousePosition.x - 128,
          top: mousePosition.y - 128
        }}
        animate={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};
```

#### Number Counter Animation
```typescript
const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    const controls = animate(0, value, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (latest) => {
        node.textContent = prefix + formatNumber(latest) + suffix;
      }
    });
    
    return () => controls.stop();
  }, [value]);
  
  return <span ref={nodeRef} />;
};

// Usage
<AnimatedNumber value={totalBalance} prefix="R$ " />
```

#### Chart Animations
```typescript
const chartVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { 
        delay: i * 0.2, 
        duration: 1.5, 
        ease: 'easeInOut' 
      },
      opacity: { delay: i * 0.2, duration: 0.3 }
    }
  })
};
```

---

## 4. Diretrizes UX

### 4.1 Jornada do Usuário

#### Onboarding Flow
1. **Welcome Screen** - Animação de logo, value proposition
2. **Workspace Creation** - Form simples, assistido
3. **First Account** - Conectar primeira conta ou criar manual
4. **First Transaction** - Tutorial interativo
5. **Dashboard Tour** - Highlight dos principais recursos

#### Navigation Patterns
- **Breadcrumb** para hierarquia profunda
- **Command Palette** (Cmd+K) para acesso rápido
- **Recent Items** no dashboard
- **Favoritos** para acesso rápido

### 4.2 Mobile-First Responsivo

#### Breakpoints
```css
/* Tailwind default */
sm: 640px   /* Tablets */
md: 768px   /* Tablets landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

#### Mobile Adaptations
- **Bottom Navigation** em vez de sidebar
- **Swipe Gestures** para ações rápidas (excluir, editar)
- **Pull-to-refresh** nas listas
- **Touch-friendly** targets (min 44px)
- **Simplified Charts** para telas pequenas

### 4.3 Acessibilidade (WCAG 2.1 AA)

#### Keyboard Navigation
```typescript
// useFocusTrap hook
const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive]);
  
  return containerRef;
};
```

#### ARIA Labels
```typescript
// Button com ARIA completo
<Button
  aria-label="Adicionar nova transação"
  aria-pressed={isActive}
  aria-describedby={tooltipId}
>
  <Plus aria-hidden="true" />
  <span>Nova Transação</span>
</Button>

// Form fields
<Input
  id="amount"
  aria-label="Valor da transação"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? 'amount-error' : 'amount-hint'}
/>
{error && (
  <span id="amount-error" role="alert" className="text-danger-500">
    {error}
  </span>
)}
```

#### Screen Reader Support
```typescript
// Live regions para atualizações dinâmicas
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {notification}
</div>

// Skip link para navegação
<a href="#main-content" className="skip-link">
  Pular para conteúdo principal
</a>
```

### 4.4 Dark Mode

```typescript
// Context para tema
type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}>(null!);

// Tailwind dark mode config
tailwind.config = {
  darkMode: 'class',
  // ... rest of config
};

// Uso
<html className={resolvedTheme === 'dark' ? 'dark' : ''}>
  <body className="bg-bg-primary text-text-primary">
    {/* content */}
  </body>
</html>
```

---

## 5. Instalações Obrigatórias

### 5.1 Pacotes Essenciais

```bash
# Animações
npm install framer-motion

# Ícones
npm install lucide-react

# Data fetching & estado
npm install @tanstack/react-query zustand

# Formulários
npm install react-hook-form zod @hookform/resolvers

# Datas
npm install date-fns

# Formatação de moeda
npm install react-currency-input-field

# Gráficos
npm install recharts

# Tabela avançada
npm install @tanstack/react-table

# Virtualização (listas grandes)
npm install react-window

# Class utilities
npm install clsx tailwind-merge
```

### 5.2 Configuração Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        secondary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        info: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        // Surface colors (dark mode)
        bg: {
          primary: '#0F172A',
          secondary: '#1E293B',
          tertiary: '#334155',
          elevated: '#1E293B',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          tertiary: '#64748B',
          disabled: '#475569',
        },
        border: {
          light: '#334155',
          medium: '#475569',
          focus: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

### 5.3 CSS Global

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border-light;
  }
  
  html {
    @apply antialiased;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
  
  body {
    @apply bg-bg-primary text-text-primary font-sans;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-bg-secondary rounded-full;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-gray-600 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500;
  }
  
  /* Selection */
  ::selection {
    @apply bg-primary-500/30 text-white;
  }
}

@layer components {
  .glass-card {
    @apply bg-bg-secondary/70 backdrop-blur-xl border border-white/[0.08] rounded-2xl;
  }
  
  .gradient-border {
    @apply relative;
  }
  
  .gradient-border::before {
    content: '';
    @apply absolute inset-[-2px] bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[inherit] -z-10;
  }
  
  .glow-primary {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1);
  }
  
  .glow-success {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.1);
  }
  
  .glow-danger {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1);
  }
  
  .text-gradient {
    @apply bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent;
  }
}

@layer utilities {
  .animate-delay-100 { animation-delay: 100ms; }
  .animate-delay-200 { animation-delay: 200ms; }
  .animate-delay-300 { animation-delay: 300ms; }
  .animate-delay-400 { animation-delay: 400ms; }
  .animate-delay-500 { animation-delay: 500ms; }
}
```

---

## 6. Assets & Recursos

### 6.1 Ícones (Lucide)

**Ícones por Contexto:**
- **Navegação:** `LayoutDashboard`, `Wallet`, `ArrowLeftRight`, `PieChart`, `Target`, `FileText`, `Settings`
- **Transações:** `Plus`, `Minus`, `TrendingUp`, `TrendingDown`, `Repeat`
- **Contas:** `CreditCard`, `Building2`, `Wallet`, `Landmark`, `CircleDollarSign`
- **Status:** `CheckCircle2`, `XCircle`, `AlertCircle`, `Clock`, `Loader2`
- **Ações:** `Pencil`, `Trash2`, `MoreHorizontal`, `Filter`, `Search`, `Download`, `Upload`

### 6.2 Ilustrações

- **Empty States:** Ilustrações SVG leves para estados vazios
- **Onboarding:** Animações Lottie para tutoriais
- **Success/Error:** Animações para feedback

---

**Design System Versionado**  
Última atualização: 2026-02-16  
Sistema: FinControl - Gestão Financeira
