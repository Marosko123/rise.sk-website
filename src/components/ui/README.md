# UI Components Documentation

This directory contains reusable UI components built with React, TypeScript, and Tailwind CSS.

## Components

### Button
A versatile button component with multiple variants and built-in animations.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" href="/contact">
  Get Started
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `href`: Optional link (renders as Link when provided)
- `icon`: Lucide icon component
- `iconPosition`: 'left' | 'right'
- `loading`: Show loading spinner
- All standard button HTML attributes

### Card
A flexible card component with glass morphism styling.

```tsx
import { Card } from '@/components/ui';

<Card variant="glass" padding="lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

**Props:**
- `variant`: 'default' | 'glass' | 'solid'
- `padding`: 'sm' | 'md' | 'lg' | 'xl'
- `hover`: Enable hover effects
- `className`: Additional CSS classes

### Section
A layout component for consistent section spacing and styling.

```tsx
import { Section } from '@/components/ui';

<Section id="about" background="gradient" maxWidth="7xl">
  <h2>About Us</h2>
</Section>
```

**Props:**
- `background`: 'default' | 'gradient' | 'dark' | 'transparent'
- `padding`: 'sm' | 'md' | 'lg' | 'xl'
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'

### Input
Form input component with label and error handling.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  required
  error={errors.email}
  variant="glass"
/>
```

**Props:**
- `label`: Input label
- `error`: Error message
- `variant`: 'default' | 'filled' | 'glass'
- `inputSize`: 'sm' | 'md' | 'lg'
- All standard input HTML attributes

### TextArea
Textarea component with consistent styling.

```tsx
import { TextArea } from '@/components/ui';

<TextArea
  label="Message"
  rows={4}
  variant="glass"
  placeholder="Your message..."
/>
```

### Select
Select dropdown component with consistent styling.

```tsx
import { Select } from '@/components/ui';

<Select
  label="Service"
  options={[
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Apps' }
  ]}
  placeholder="Choose a service"
/>
```

## Hooks

### useForm
Form state management hook with validation and submission handling.

```tsx
import { useForm } from '@/hooks';

const { values, errors, handleSubmit, getFieldProps } = useForm({
  initialValues: { email: '', message: '' },
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Email is required';
    return errors;
  },
  onSubmit: async (values) => {
    // Handle form submission
  }
});
```

## Design System

### Colors
- Primary: `#b09155` (bronze/gold)
- Primary Dark: `#9a7f4b`
- Primary Light: `#d4af37`

### Animation Utilities
Import from `@/utils/animations`:
- `fadeInUp`: Standard fade in from bottom
- `fadeInLeft`: Fade in from left
- `fadeInRight`: Fade in from right
- `staggerContainer`: Container for staggered children
- `scaleOnHover`: Scale animation on hover
- `slideUpOnScroll`: Slide up when scrolled into view

### Constants
Import from `@/utils/constants`:
- `COLORS`: Brand color palette
- `SPACING`: Consistent spacing scale
- `TYPOGRAPHY`: Font sizes and weights
- `BREAKPOINTS`: Responsive breakpoints

## Best Practices

1. **Consistent Styling**: Use the design system constants for colors, spacing, and typography
2. **Accessibility**: All components include proper ARIA attributes and keyboard navigation
3. **Responsive Design**: Components are built mobile-first with responsive breakpoints
4. **Performance**: Components use React.memo and useCallback where appropriate
5. **Type Safety**: Full TypeScript support with exported interfaces
6. **Animation**: Smooth animations using Framer Motion with reduced motion respect

## Usage Examples

### Creating a Contact Form
```tsx
import { Card, Input, TextArea, Select, Button } from '@/components/ui';
import { useForm } from '@/hooks';

function ContactForm() {
  const { handleSubmit, getFieldProps, isSubmitting } = useForm({
    initialValues: { name: '', email: '', service: '', message: '' },
    onSubmit: async (values) => {
      // Submit form
    }
  });

  return (
    <Card variant="glass" padding="lg">
      <form onSubmit={handleSubmit}>
        <Input label="Name" {...getFieldProps('name')} />
        <Input label="Email" type="email" {...getFieldProps('email')} />
        <Select label="Service" {...getFieldProps('service')} />
        <TextArea label="Message" {...getFieldProps('message')} />
        <Button type="submit" loading={isSubmitting}>
          Send Message
        </Button>
      </form>
    </Card>
  );
}
```

### Creating a Feature Section
```tsx
import { Section, Card } from '@/components/ui';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { motion } from 'framer-motion';

function Features() {
  return (
    <Section background="gradient" maxWidth="7xl">
      <motion.div variants={staggerContainer} initial="initial" whileInView="animate">
        <motion.h2 variants={fadeInUp}>Our Features</motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card hover padding="lg">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
```
