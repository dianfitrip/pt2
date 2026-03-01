import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  LogIn,
  User,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("http://localhost:3000/api/auth/login", formData);

      if (res.data.success) {
        const { token, user } = res.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess(true);

        setTimeout(() => {
          const role = user.role.toLowerCase();
          if (role === "admin") navigate("/admin/dashboard");
          else if (role === "asesor") navigate("/asesor/dashboard");
          else if (role === "tuk") navigate("/tuk/dashboard");
          else navigate("/dashboard");
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server tidak merespon");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#071E3D] font-sans selection:bg-orange-500/30">
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="office" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#071E3D] via-[#071E3D]/90 to-transparent" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" 
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">SIMLSP</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-7xl font-black text-white leading-[1.1] mb-8">
              Expertise <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Validated.
              </span>
            </h1>
            <p className="text-slate-400 text-xl max-w-lg leading-relaxed font-light">
              Platform integrasi sertifikasi profesi nasional. Memastikan standar kompetensi global untuk tenaga kerja unggul Indonesia.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-10">
          <div>
            <p className="text-white font-black text-2xl">2.5k+</p>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Active Asesi</p>
          </div>
          <div>
            <p className="text-white font-black text-2xl">180+</p>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Skema Sertifikasi</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-[#071E3D] lg:bg-white relative">
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-white lg:text-[#071E3D] tracking-tight mb-3">
              Selamat <span className="text-orange-500">Datang.</span>
            </h2>
            <p className="text-slate-400 font-medium">Silakan masuk untuk mengelola dashboard Anda</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[11px] font-black text-white lg:text-[#071E3D] uppercase ml-1 tracking-widest opacity-70">
                Identitas Pengguna
              </label>
              <div className="relative group">
                <div className="absolute left-0 w-12 h-full flex items-center justify-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <input
                  required
                  placeholder="Username / ID"
                  className="w-full pl-12 pr-6 py-4 bg-slate-500/10 lg:bg-slate-50 border-b-2 border-slate-700 lg:border-slate-100 focus:border-orange-500 focus:bg-white lg:rounded-2xl transition-all font-bold text-white lg:text-[#071E3D] placeholder:text-slate-500"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[11px] font-black text-white lg:text-[#071E3D] uppercase ml-1 tracking-widest opacity-70">
                Kata Sandi
              </label>
              <div className="relative group">
                <div className="absolute left-0 w-12 h-full flex items-center justify-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={20} strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-4 bg-slate-500/10 lg:bg-slate-50 border-b-2 border-slate-700 lg:border-slate-100 focus:border-orange-500 focus:bg-white lg:rounded-2xl transition-all font-bold text-white lg:text-[#071E3D] placeholder:text-slate-500"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <button type="button" className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline underline-offset-4">
                Lupa Akses?
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold flex items-center gap-3"
                >
                  <AlertCircle size={18} /> {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-xs font-bold flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={18} /> Otentikasi Berhasil
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              variants={itemVariants}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || success}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Masuk Sistem</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                </>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-16 text-center">
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.3em]">
              SIMLSP Integrated System &bull; 2026
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}