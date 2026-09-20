/**
 * Footer Component
 * Styled with Tailwind CSS matching the Figma design.
 */
export function Footer({
  copyright = '© 2026 Jes tae tver tv',
  links = [
    { label: 'About', href: '#about' },
    { label: 'For freelancers', href: '#freelancers' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Contact', href: '#contact' },
  ],
}) {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 font-normal m-0">
          {copyright}
        </p>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 list-none m-0 p-0">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150"
                >
                  yo
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
