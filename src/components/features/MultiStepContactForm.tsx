'use client';

import ContactForm from './contact/ContactForm';

interface MultiStepContactFormProps {
  className?: string;
  id?: string;
}

export default function MultiStepContactForm({ className, id }: MultiStepContactFormProps) {
  return <ContactForm className={className} id={id} />;
}
