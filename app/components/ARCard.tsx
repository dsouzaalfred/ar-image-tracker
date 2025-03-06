import Link from 'next/link';

interface ARCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export default function ARCard({ title, description, href, icon }: ARCardProps) {
  return (
    <Link href={href} className="bg-white rounded-xl p-5 no-underline text-[#1d1d1f] transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:-translate-y-0.5">
      <h2 className="flex items-center gap-2.5 m-0 mb-2.5">
        <span className="w-6 h-6 inline-block">{icon}</span>
        {title}
      </h2>
      <p className="m-0 text-[#86868b] text-sm leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
