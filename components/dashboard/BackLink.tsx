import Link from "next/link";

interface Props {
  href: string;
  label?: string;
}

export default function BackLink({ href, label = "Volver" }: Props) {
  return (
    <Link href={href} className="text-sage hover:text-forest text-sm transition-colors">
      ← {label}
    </Link>
  );
}
