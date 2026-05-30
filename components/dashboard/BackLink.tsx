import Link from "next/link";

interface Props {
  href: string;
  label?: string;
}

export default function BackLink({ href, label = "Volver" }: Props) {
  return (
    <Link href={href} className="text-forest-dark hover:underline text-sm transition-colors">
      ← {label}
    </Link>
  );
}
