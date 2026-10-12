import React, { useEffect, useState } from 'react';
import { useRouteError, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAppContext } from '@/context/AppContext';
import { fetchSettings } from '@/utils/api';

export function Layout({ children, noFooter = false }) {
  const { settings, setSettings } = useAppContext();

  useEffect(() => {
    if (!settings) {
      fetchSettings().then(setSettings).catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-foreground relative">
      {/* Global Glassmorphic Food Background */}
      <div className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000&auto=format&fit=crop)" }}></div>
      <div className="fixed inset-0 z-[-1] bg-background/70 backdrop-blur-3xl"></div>
      <Header settings={settings} />
      <main className="flex-1 pb-16 md:pb-0 pt-[104px] md:pt-[130px]">
        {children}
      </main>
      {!noFooter && <Footer settings={settings} />}
    </div>
  );
}

export function PageError() {
  const error = useRouteError();
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="text-7xl mb-4">😵</div>
        <h1 className="text-3xl font-black mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">{error?.message || 'An unexpected error occurred.'}</p>
        <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90">Go Home</Link>
      </div>
    </Layout>
  );
}

export function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8">
        <div className="text-[120px] leading-none mb-4">🍽️</div>
        <h1 className="text-6xl font-black font-serif text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground text-lg mb-8">Looks like this page flew off the menu!</p>
        <div className="flex gap-4">
          <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition">Go Home</Link>
          <Link to="/menu" className="border-2 border-primary text-primary px-6 py-3 rounded-full font-bold hover:bg-primary/5 transition">View Menu</Link>
        </div>
      </div>
    </Layout>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-primary transition">Home</Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span>/</span>
          {item.to ? <Link to={item.to} className="hover:text-primary transition">{item.label}</Link>
            : <span className="text-foreground font-semibold">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function EmptyState({ icon = '🍽️', title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground text-sm mb-6 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}



