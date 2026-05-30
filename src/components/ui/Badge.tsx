type Variant = 'green' | 'red' | 'amber' | 'gray' | 'indigo';

const styles: Record<Variant, string> = {
  green:  'bg-green-50  text-green-700',
  red:    'bg-red-50    text-red-700',
  amber:  'bg-amber-50  text-amber-700',
  gray:   'bg-gray-100  text-gray-600',
  indigo: 'bg-indigo-50 text-indigo-700',
};

interface Props {
  label: string;
  variant?: Variant;
}

export default function Badge({ label, variant = 'gray' }: Props) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${styles[variant]}`}>
      {label}
    </span>
  );
}
