import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background-alt border-t border-border">
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <p className="text-[10px] text-foreground-subtle leading-relaxed">
          Operated by Sammy Corporation
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-foreground-subtle">
          <Link
            href="/terms"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>
          <span>|</span>
          <Link
            href="/privacy"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <span>|</span>
          <a href="#" className="hover:text-foreground transition-colors">
            Legal Notice
          </a>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1.5 text-[10px] text-foreground-subtle">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Instagram
          </a>
          <span>|</span>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            YouTube
          </a>
        </div>
        <p className="mt-2 text-[10px] text-foreground-subtle">
          <a
            href="mailto:support@example.com"
            className="hover:text-foreground transition-colors"
          >
            support@example.com
          </a>
        </p>
      </div>
    </footer>
  );
}
