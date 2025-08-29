const Footer = () => (
  <footer className="w-full py-8 text-center text-gray-400 text-sm border-t border-gray-700">
    <p>
      &copy; {new Date().getFullYear()} Tolatu. All rights reserved. Built
      with 💡 by
      <a
        href="https://github.com/auspicious14"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-500 hover:underline"
      >
        Auspicious
      </a>
    </p>
  </footer>
);

export default Footer;
