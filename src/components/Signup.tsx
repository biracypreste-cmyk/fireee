import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import redflixLogo from 'figma:asset/0fd04bd0f4dd3d36db506b272ad022b23cf78263.png';

// Icon inline to avoid lucide-react dependency
const Check = ({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

interface SignupProps {
  onBack: () => void;
  onContinue: () => void;
}

export function Signup({ onBack, onContinue }: SignupProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && password === confirmPassword) {
      setStep(2);
    }
  };

  const handleContinue = () => {
    onContinue();
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header com Logo */}
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <ImageWithFallback
              src={redflixLogo}
              alt="RedFlix Logo"
              className="h-10 w-auto"
            />
            <button
              onClick={onBack}
              className="text-white hover:text-[#E50914] transition-colors font-['Montserrat:Semi_Bold',sans-serif] text-[16px]"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#333333] h-1">
          <div 
            className="h-full bg-[#E50914] transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-[500px] bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 shadow-2xl shadow-black/50">
            {step === 1 && (
              <div className="space-y-8">
                {/* Título */}
                <div className="text-center space-y-2">
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px] uppercase tracking-wider">
                    ETAPA 1 DE 3
                  </p>
                  <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[36px]">
                    Crie sua conta
                  </h2>
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[18px] leading-relaxed">
                    Apenas mais alguns passos e pronto!<br />
                    Não curtimos papelada.
                  </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  {/* Input E-mail */}
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail"
                      className="w-full bg-[#333333] text-white rounded px-5 py-4 font-['Roboto:Regular',sans-serif] text-[16px] border border-transparent focus:border-[#E50914] focus:outline-none transition-all placeholder:text-[#B3B3B3]"
                      required
                    />
                  </div>

                  {/* Input Senha */}
                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Adicionar senha"
                      className="w-full bg-[#333333] text-white rounded px-5 py-4 font-['Roboto:Regular',sans-serif] text-[16px] border border-transparent focus:border-[#E50914] focus:outline-none transition-all placeholder:text-[#B3B3B3]"
                      required
                      minLength={6}
                    />
                  </div>

                  {/* Input Confirmar Senha */}
                  <div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua senha"
                      className="w-full bg-[#333333] text-white rounded px-5 py-4 font-['Roboto:Regular',sans-serif] text-[16px] border border-transparent focus:border-[#E50914] focus:outline-none transition-all placeholder:text-[#B3B3B3]"
                      required
                    />
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 mt-0.5 accent-[#E50914] cursor-pointer"
                      required
                    />
                    <span className="text-[#B3B3B3] group-hover:text-white transition-colors font-['Roboto:Regular',sans-serif] text-[14px] leading-relaxed">
                      Sim, quero receber ofertas especiais e recomendações personalizadas da RedFlix.
                    </span>
                  </label>

                  {/* Botão Continuar */}
                  <button
                    type="submit"
                    className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-5 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E50914]/50 active:scale-95"
                  >
                    Avançar
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                {/* Título */}
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E50914]/20 flex items-center justify-center">
                    <Check className="w-12 h-12 text-[#E50914]" strokeWidth={3} />
                  </div>
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px] uppercase tracking-wider">
                    ETAPA 2 DE 3
                  </p>
                  <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[36px]">
                    Escolha seu plano
                  </h2>
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start gap-3 text-left">
                      <Check className="w-6 h-6 text-[#E50914] shrink-0 mt-1" strokeWidth={2.5} />
                      <p className="text-white font-['Roboto:Regular',sans-serif] text-[18px]">
                        Sem compromisso, cancele quando quiser.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <Check className="w-6 h-6 text-[#E50914] shrink-0 mt-1" strokeWidth={2.5} />
                      <p className="text-white font-['Roboto:Regular',sans-serif] text-[18px]">
                        Entretenimento sem fim por um preço único e justo.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <Check className="w-6 h-6 text-[#E50914] shrink-0 mt-1" strokeWidth={2.5} />
                      <p className="text-white font-['Roboto:Regular',sans-serif] text-[18px]">
                        Assista onde quiser e quando quiser.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão */}
                <button
                  onClick={handleContinue}
                  className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-5 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E50914]/50 active:scale-95"
                >
                  Ver os planos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
