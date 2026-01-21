export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen">
      {/* your admin header/sidebar can go here */}
      {children}
    </div>
  );
}
