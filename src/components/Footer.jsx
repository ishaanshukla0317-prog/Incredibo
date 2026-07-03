const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-900 py-6 text-center text-sm text-gray-400">
      <p>&copy; {currentYear} incredibo. All rights reserved.</p>
    </footer>
  );
};

export default Footer;