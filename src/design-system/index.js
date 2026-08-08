/**
 * Design System — Barrel exports
 */

export { tokens, generateCSSVariables, getModuleColors, getStateColor } from './tokens.js';
export { globalStyles } from './globalStyles.js';

// Layout primitives
export { Page, Container, Section, Grid, Flex, Stack } from '../components/layout/Primitives.jsx';

// Core UI
export { Button, Card, Callout, Badge, Input, Divider, Avatar } from '../components/ui/Core.jsx';

// Content components
export { Diagram, CodeBlock, Stepper, Table, Hero, Accordion, Tabs } from '../components/ui/Content.jsx';

// Navigation
export { Sidebar, TopBar, CommandPalette, ModuleSwitcher } from '../components/ui/Navigation.jsx';

// Feedback
export { ToastProvider, useToast, Modal, Tooltip, Skeleton, EmptyState, Progress } from '../components/ui/Feedback.jsx';