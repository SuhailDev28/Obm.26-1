import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Badge({ settings, children }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
      style={{
        borderColor: `${settings.primaryColor}33`,
        backgroundColor: `${settings.primaryColor}14`,
        color: settings.primaryColor,
      }}
    >
      <Sparkles className="h-4 w-4" /> {children}
    </span>
  );
}

export function SectionTitle({ settings, eyebrow, title, text }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p
        className="mb-3 text-sm font-semibold uppercase tracking-[0.25em]"
        style={{ color: settings.primaryColor }}
      >
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">{text}</p>}
    </div>
  );
}

export function ServiceCard({ service, index, settings }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:bg-white/[0.07]"
    >
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${settings.primaryColor}14`, color: settings.primaryColor }}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-white">{service.title}</h3>
      <p className="mt-4 leading-7 text-slate-300">{service.text}</p>
    </motion.div>
  );
}
