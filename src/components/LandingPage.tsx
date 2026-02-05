"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Users,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const problems = [
    "Manual invoicing pakai Excel/Word memakan waktu 2-3 jam per minggu",
    "Tracking payment status ribet dan tidak terorganisir",
    "Invoice sering telat terkirim karena proses manual",
    "Sulit monitor cash flow secara real-time",
  ];

  const features = [
    {
      icon: Users,
      title: "Manage Clients",
      description: "Kelola data client dengan mudah dalam satu tempat",
    },
    {
      icon: FileText,
      title: "Generate Invoices",
      description: "Buat invoice professional dalam 2 menit",
    },
    {
      icon: CheckCircle,
      title: "Track Payments",
      description: "Monitor status pembayaran Invoice",
    },
    {
      icon: TrendingUp,
      title: "Cash Flow Dashboard",
      description: "Visualisasi cash flow yang jelas dan insightful",
    },
  ];

  const stats = [
    { value: "2 min", label: "Buat Invoice" },
    { value: "100%", label: "Professional" },
    { value: "Real-time", label: "Tracking" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-teal-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" />
                BillFlow
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Kelola Invoice{" "}
                <span className="text-teal-600">Lebih Cepat</span> &
                Professional
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-600 mb-8 leading-relaxed"
              >
                Platform invoice management modern untuk freelancers dan small
                businesses. Hemat waktu, tingkatkan profesionalitas, dan monitor
                cash flow dengan mudah.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link
                  href="/signup"
                  className="w-full group inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-3xl font-semibold text-lg hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Mulai Gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center gap-2 bg-white text-teal-600 border-2 border-teal-600 px-8 py-4 rounded-3xl font-semibold text-lg hover:bg-teal-50 transition-all"
                >
                  Login
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-6"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center sm:text-left">
                    <div className="text-3xl font-bold text-teal-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Animated Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="aspect-video w-full">
                    <Image
                      src="/dashboard.png"
                      alt="BillFlow Dashboard Preview"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-200 rounded-full opacity-50 blur-2xl -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal-300 rounded-full opacity-30 blur-3xl -z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Masalah yang Sering Dialami
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lelah dengan Proses Invoice Manual?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-2 shrink-0"></div>
                <p className="text-gray-700">{problem}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Solusi All-in-One
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platform lengkap untuk mengelola invoice, client, dan cash flow
              dalam satu tempat
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-linear-to-br from-teal-50 to-white p-8 rounded-2xl border border-teal-100 hover:border-teal-300 transition-all shadow-sm hover:shadow-lg"
                >
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-teal-600 to-teal-700 rounded-2xl py-16 px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">
                  Siap Tingkatkan Profesionalitas Invoice Kamu?
                </h2>
                <p className="text-lg text-teal-100 mb-8">
                  Bergabung dengan ribuan freelancers dan small businesses yang
                  sudah menggunakan BillFlow
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-white text-teal-600 px-10 py-5 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl"
                >
                  Mulai Gratis Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-lg font-bold text-white mb-4">BillFlow</div>
            <p className="mb-4 text-base">Modern invoice management untuk profesional</p>
            <p className="text-xs">© 2024 BillFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
