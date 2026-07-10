import React from 'react';
import { Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-8 shadow-2xl text-center space-y-6"
      >
        <div className="w-14 h-14 bg-blue-950/40 border border-blue-900/50 text-blue-400 rounded-lg flex items-center justify-center mx-auto shadow-inner">
          <Compass size={28} />
        </div>

        <div className="space-y-2">
          <h1 className="text-lg font-bold text-white uppercase tracking-wider">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested resource, dashboard view, or mission interlock workspace does not exist or has been archived in the database registries.
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-xs font-semibold uppercase tracking-wider py-2.5"
            onClick={() => navigate('/select-role')}
          >
            Identity Gateway
          </Button>
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>SYSTEM RUNNING</span>
          <span>CODE: 404_NOT_FOUND</span>
        </div>
      </motion.div>
    </div>
  );
}
