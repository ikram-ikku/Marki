export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
        <div className="footer-inner">
            <p className="footer-logo">MARKI</p>
            <p className="footer-tag">Handcrafted leather footwear, since always.</p>
            <p className="footer-copy">&copy; <span>{currentYear}</span> Marki. All rights reserved.</p>
        </div>
    </footer>
  );
}
