'use client';

import { useState, useEffect, useRef } from 'react';
import { usePortalState } from '@/hooks/usePortalState';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Play, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckSquare, 
  AlertTriangle,
  Award,
  BarChart2,
  HelpCircle,
  TrendingUp,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 20 Mock Questions covering 4 topics
const MOCK_QUESTIONS = [
  // Research Aptitude (5)
  {
    id: 1,
    topic: 'Research Aptitude',
    q: 'Which of the following is the correct order of phases in the scientific research process?',
    options: [
      'Data Collection → Formulation of Hypothesis → Research Design → Data Analysis',
      'Formulation of Research Question → Hypothesis Formulation → Research Design → Data Collection → Data Analysis → Inference Formulation',
      'Research Design → Data Collection → Hypothesis Formulation → Inference Formulation',
      'Formulation of Research Question → Data Analysis → Hypothesis Formulation → Data Collection'
    ],
    answer: 1 // 0-indexed (2nd option)
  },
  {
    id: 2,
    topic: 'Research Aptitude',
    q: 'What is the main purpose of a literature review in doctoral research?',
    options: [
      'To increase the page count of the final thesis document',
      'To copy theories proposed by other prominent research guides',
      'To identify critical research gaps and position the proposed study within the existing scientific landscape',
      'To provide a list of definitions of standard department terms'
    ],
    answer: 2
  },
  {
    id: 3,
    topic: 'Research Aptitude',
    q: 'A research study where researcher controls variables to determine cause-and-effect is classified as:',
    options: [
      'Descriptive Research',
      'Qualitative Ethnographic Study',
      'Historical Synthesis Research',
      'Experimental Research'
    ],
    answer: 3
  },
  {
    id: 4,
    topic: 'Research Aptitude',
    q: 'Which sampling technique guarantees that every element of the population possesses an equal probability of selection?',
    options: [
      'Convenience Non-probability Sampling',
      'Simple Random Sampling',
      'Snowball Subject Referral Sampling',
      'Quota Structured Sampling'
    ],
    answer: 1
  },
  {
    id: 5,
    topic: 'Research Aptitude',
    q: 'What represents an "independent variable" in a scientific research model?',
    options: [
      'The variable that is manipulated or changed by the investigator to observe its effect',
      'The outcome variable that is measured for changes',
      'A confounding external variable that is kept constant',
      'The mathematical constant defined in research algorithms'
    ],
    answer: 0
  },

  // Logical Reasoning (5)
  {
    id: 6,
    topic: 'Logical Reasoning',
    q: 'If all research scholars are dedicated (All S are D), and some dedicated individuals are guides (Some D are G), which of the following must be true?',
    options: [
      'All research scholars are guides',
      'Some research scholars are guides',
      'No research scholar is a guide',
      'None of the above statements is logically guaranteed'
    ],
    answer: 3
  },
  {
    id: 7,
    topic: 'Logical Reasoning',
    q: 'Identify the next term in the logical series: RPET02, RPET06, RPET14, RPET30, ?',
    options: ['RPET45', 'RPET62', 'RPET58', 'RPET64'],
    answer: 1 // diffs are 4, 8, 16, 32 => 30 + 32 = 62
  },
  {
    id: 8,
    topic: 'Logical Reasoning',
    q: 'Statements: (I) All computers need electricity. (II) Laptop is a computer. Conclusion: Laptops need electricity. This deduction is:',
    options: ['Logically Valid', 'Logically Invalid', 'Inductive Generalization', 'Ambiguous Interpretation'],
    answer: 0
  },
  {
    id: 9,
    topic: 'Logical Reasoning',
    q: 'In a coding scheme, "RESEARCH" is written as "SFTFBSDI". How will "DOCTOR" be coded under this schema?',
    options: ['EPDUPS', 'EPEUPS', 'DPDVPQ', 'EQDVPS'],
    answer: 0 // each letter shifted by +1
  },
  {
    id: 10,
    topic: 'Logical Reasoning',
    q: 'Pointing to a portrait, Kabir says: "He is the only son of the father of my daughter\'s father." Who is the person in the portrait?',
    options: ['Kabir\'s Brother', 'Kabir himself', 'Kabir\'s Father', 'Kabir\'s Son'],
    answer: 1
  },

  // Quantitative Aptitude (5)
  {
    id: 11,
    topic: 'Quantitative Aptitude',
    q: 'The average marks of 30 scholars in a computer research test is 80. If the top 5 scores are excluded, the average drops to 75. What is the average score of the top 5 scholars?',
    options: ['95', '100', '105', '110'],
    answer: 2 // total = 30*80 = 2400. left = 25*75 = 1875. top 5 total = 525 => avg = 525/5 = 105
  },
  {
    id: 12,
    topic: 'Quantitative Aptitude',
    q: 'A guide can review 12 synopses in 4 hours. A co-guide takes 6 hours to complete the same work. How long will they take to review 12 synopses if they work collaboratively?',
    options: ['2.4 Hours', '3.2 Hours', '2.0 Hours', '2.8 Hours'],
    answer: 0 // rate A = 3/hr, rate B = 2/hr => combined = 5/hr => 12/5 = 2.4 hrs
  },
  {
    id: 13,
    topic: 'Quantitative Aptitude',
    q: 'What is the probability of drawing either a king or a spade from a standard deck of 52 playing cards?',
    options: ['4/13', '17/52', '16/52', '9/26'],
    answer: 0 // 13 spades + 4 kings - 1 king of spades = 16 cards => 16/52 = 4/13
  },
  {
    id: 14,
    topic: 'Quantitative Aptitude',
    q: 'If the price of research software licenses is increased by 25%, by what percentage must a department reduce its volume of purchase to keep total expenditures unchanged?',
    options: ['25%', '20%', '15%', '30%'],
    answer: 1 // 1 - 1/1.25 = 0.20 = 20%
  },
  {
    id: 15,
    topic: 'Quantitative Aptitude',
    q: 'If the value of a lab centrifuge depreciates at 10% per annum compound interest, what will be its value in 2028 if its cost in 2026 was Rs. 1,00,000?',
    options: ['Rs. 90,000', 'Rs. 81,000', 'Rs. 72,900', 'Rs. 80,000'],
    answer: 1 // 100000 * 0.9 * 0.9 = 81000
  },

  // English Verbal Aptitude (5)
  {
    id: 16,
    topic: 'English',
    q: 'Identify the word that is most nearly opposite in meaning to the word: EPHEMERAL',
    options: ['Transient', 'Enduring', 'Incidental', 'Ethereal'],
    answer: 1 // Ephemeral = short-lived, Opposite = enduring
  },
  {
    id: 17,
    topic: 'English',
    q: 'Fill in the blank with appropriate preposition: "The doctoral candidates were advised to adhere ________ the formatting guidelines specified in the RGU thesis manual."',
    options: ['with', 'by', 'to', 'for'],
    answer: 2
  },
  {
    id: 18,
    topic: 'English',
    q: 'Choose the correctly spelled academic term from the options below:',
    options: ['Exaggerated', 'Exagerated', 'Exaggeratedd', 'Exagarated'],
    answer: 0
  },
  {
    id: 19,
    topic: 'English',
    q: 'Identify the sentence that uses punctuation marks correctly:',
    options: [
      'The research proposal; however, needs complete revision.',
      'The research proposal, however, needs complete revision.',
      'The research proposal, however needs complete revision.',
      'The research proposal however, needs complete revision.'
    ],
    answer: 1
  },
  {
    id: 20,
    topic: 'English',
    q: 'Select the synonym for the word: PRAGMATIC',
    options: ['Idealistic', 'Practical', 'Theoretical', 'Vague'],
    answer: 1
  }
];

export default function MockTestPlatform() {
  const { activeUser, saveMockTestScore } = usePortalState();
  const [testState, setTestState] = useState<'intro' | 'active' | 'results'>('intro');
  
  // Test taker states
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(2400); // 40 minutes in seconds
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Start timer on active state
  useEffect(() => {
    if (testState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpentSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState]);

  if (!activeUser) return null;

  const handleStartTest = () => {
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(2400);
    setTimeSpentSeconds(0);
    setTestState('active');
    toast.success('RPET Mock Test initialized. Go ahead!');
  };

  const handleSelectOption = (optIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const handleNext = () => {
    if (currentIdx < 19) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleAutoSubmit = () => {
    toast.warning('Time expired! Your answers have been submitted automatically.');
    processScoreAndFinish();
  };

  const processScoreAndFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let rawScore = 0;
    const catScores = {
      researchAptitude: 0,
      logicalReasoning: 0,
      quantitativeAptitude: 0,
      english: 0
    };

    MOCK_QUESTIONS.forEach((q, idx) => {
      const selected = answers[idx];
      const correct = selected === q.answer;

      if (correct) {
        rawScore += 1;
        if (q.topic === 'Research Aptitude') catScores.researchAptitude += 1;
        else if (q.topic === 'Logical Reasoning') catScores.logicalReasoning += 1;
        else if (q.topic === 'Quantitative Aptitude') catScores.quantitativeAptitude += 1;
        else if (q.topic === 'English') catScores.english += 1;
      }
    });

    const accuracy = Math.round((rawScore / 20) * 100);
    const minStr = String(Math.floor(timeSpentSeconds / 60)).padStart(2, '0');
    const secStr = String(timeSpentSeconds % 60).padStart(2, '0');
    const timeTaken = `${minStr}:${secStr}`;

    const newResult = {
      score: rawScore,
      accuracy,
      timeTaken,
      attemptDate: new Date().toISOString().split('T')[0],
      categoryScores: catScores
    };

    saveMockTestScore(activeUser.id, newResult);

    confetti({
      particleCount: 150,
      spread: 70,
      colors: ['#0B1F3A', '#1E4D8C', '#D4A017']
    });

    setTestState('results');
    toast.success('Mock Test submitted and diagnostics generated!');
  };

  // UI calculations
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalAnswered = Object.keys(answers).length;
  const progressPercent = Math.round((totalAnswered / 20) * 100);
  const activeQ = MOCK_QUESTIONS[currentIdx];

  // Render Intro screen
  if (testState === 'intro') {
    const previousResult = activeUser.mockTestResult;

    return (
      <div className="space-y-8">
        <div className="border-b border-border-slate/60 pb-5">
          <h1 className="font-outfit font-black text-2xl text-navy-950">Mock Test Simulator</h1>
          <p className="text-xs font-semibold text-text-slate">Acclimatize with a realistic online exam environment before appearing for the official central RPET exam.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Test syllabus guidelines */}
          <div className="lg:col-span-8 premium-card bg-white border border-border-slate p-8 space-y-6 shadow-sm">
            <h3 className="font-outfit font-extrabold text-lg text-navy-950 flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-800" />
              Guidelines & Rules of Assessment
            </h3>

            <ul className="space-y-4 text-xs font-semibold text-text-slate">
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-blue-800 shrink-0" />
                <div>
                  <p className="text-navy-950">40 Minutes Duration</p>
                  <p className="text-[11px] font-medium leading-relaxed mt-0.5">The timer is active. The portal will automatically freeze inputs upon clock expiration.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckSquare className="w-5 h-5 text-blue-800 shrink-0" />
                <div>
                  <p className="text-navy-950">20 Multiple Choice Questions</p>
                  <p className="text-[11px] font-medium leading-relaxed mt-0.5">5 questions from each syllabus area: Research Aptitude, Logical Reasoning, Quantitative Aptitude, English.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Flame className="w-5 h-5 text-blue-800 shrink-0" />
                <div>
                  <p className="text-navy-950">Syllabus-Linked Diagnostic Analytics</p>
                  <p className="text-[11px] font-medium leading-relaxed mt-0.5">Instant performance grading bar charts will display upon submission.</p>
                </div>
              </li>
            </ul>

            <div className="pt-4 border-t border-border-slate/60">
              <button
                onClick={handleStartTest}
                className="px-8 py-4 rounded-xl bg-navy-950 hover:bg-blue-800 text-white font-extrabold text-[13px] flex items-center gap-2 shadow-md transition-all"
              >
                Start Practice Assessment
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Past attempt cards if present */}
          {previousResult && (
            <div className="lg:col-span-4 premium-card bg-white border border-border-slate p-6 space-y-5 shadow-sm">
              <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-500" />
                Last Attempt Summary
              </h4>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center bg-bg-slate p-3 rounded-xl">
                  <span className="text-text-slate">Analytical Score</span>
                  <span className="font-outfit font-black text-navy-950 text-base">{previousResult.score}/20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-slate">Accuracy Level</span>
                  <span className="font-extrabold text-success-green">{previousResult.accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-slate">Duration Logged</span>
                  <span className="font-extrabold text-navy-950">{previousResult.timeTaken}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-slate">Attempted Date</span>
                  <span className="font-extrabold text-navy-950">{previousResult.attemptDate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Active test interface
  if (testState === 'active') {
    return (
      <div className="space-y-6">
        
        {/* Active Header bar with progress and timer */}
        <div className="premium-glass border border-border-slate/90 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-24 z-10 shadow-sm">
          <div className="space-y-1 min-w-[200px]">
            <div className="flex justify-between text-[11px] font-bold text-navy-950">
              <span>Test Completion</span>
              <span>{progressPercent}% ({totalAnswered}/20 Answered)</span>
            </div>
            <div className="h-1.5 w-full bg-border-slate rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-800 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-navy-950 text-white py-2.5 px-4 rounded-xl font-mono text-sm font-bold shadow-md self-end sm:self-center">
            <Clock className="w-4 h-4 text-gold-500 shrink-0" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Panel Split */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Active Question Box - 8 cols */}
          <div className="lg:col-span-8 premium-card bg-white border border-border-slate min-h-[420px] flex flex-col justify-between shadow-sm">
            
            <div className="space-y-6">
              {/* Category indicator */}
              <div className="flex items-center justify-between border-b border-border-slate/60 pb-4">
                <span className="text-[10px] font-extrabold uppercase bg-gold-500/10 text-gold-500 border border-gold-500/20 px-3 py-1 rounded-full">
                  {activeQ.topic}
                </span>
                <span className="text-xs font-bold text-text-slate">Question {currentIdx + 1} of 20</span>
              </div>

              {/* Question description */}
              <h3 className="font-outfit font-bold text-base md:text-lg text-navy-950 leading-relaxed pt-2">
                {activeQ.q}
              </h3>

              {/* Options list */}
              <div className="grid gap-3 pt-2">
                {activeQ.options.map((opt, optIdx) => {
                  const isSelected = answers[currentIdx] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-xl border text-left text-xs font-bold transition-all flex gap-3 items-center ${
                        isSelected 
                          ? 'bg-navy-950/5 border-navy-950 text-navy-950' 
                          : 'bg-white border-border-slate hover:bg-surface-slate text-text-navy'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-navy-950 bg-navy-950' : 'border-border-slate'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-border-slate/60 mt-12">
              <button
                disabled={currentIdx === 0}
                onClick={handlePrev}
                className="px-5 py-3 border border-border-slate hover:bg-surface-slate rounded-xl text-xs font-bold text-navy-950 flex items-center gap-1.5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Question
              </button>

              {currentIdx < 19 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-navy-950 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={processScoreAndFinish}
                  className="px-8 py-3 bg-success-green hover:bg-success-green/95 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md"
                >
                  Complete & Submit Test
                </button>
              )}
            </div>

          </div>

          {/* Quick-Jump Index panel - 4 cols */}
          <div className="lg:col-span-4 premium-card bg-white border border-border-slate p-6 space-y-6 shadow-sm">
            <div className="border-b border-border-slate/60 pb-3 flex items-center justify-between">
              <h4 className="font-outfit font-extrabold text-xs text-navy-950 uppercase tracking-wider">Assessment Map</h4>
              <span className="text-[10px] font-bold text-text-slate">{totalAnswered}/20 Completed</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {MOCK_QUESTIONS.map((q, idx) => {
                const isSelected = currentIdx === idx;
                const isAnswered = answers[idx] !== undefined;

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-10 h-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-navy-950 text-white border-2 border-navy-950 shadow-sm' 
                        : isAnswered 
                        ? 'bg-success-green/10 text-success-green border border-success-green/20' 
                        : 'bg-bg-slate border border-border-slate text-text-slate hover:border-navy-950/20'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border-slate/60 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-text-slate">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-navy-950 rounded" />
                <span className="text-navy-950">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-success-green/10 text-success-green border border-success-green/20 rounded" />
                <span className="text-success-green">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-bg-slate border border-border-slate rounded" />
                <span>Unanswered</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // Render Diagnostic results
  if (testState === 'results') {
    const res = activeUser.mockTestResult!;
    
    // Format Recharts data
    const chartData = [
      { name: 'Research Apt.', Score: res.categoryScores.researchAptitude, Total: 5 },
      { name: 'Logical Reas.', Score: res.categoryScores.logicalReasoning, Total: 5 },
      { name: 'Quant. Apt.', Score: res.categoryScores.quantitativeAptitude, Total: 5 },
      { name: 'English', Score: res.categoryScores.english, Total: 5 }
    ];

    return (
      <div className="space-y-8">
        
        {/* Header */}
        <div className="border-b border-border-slate/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-outfit font-black text-2xl text-navy-950">Practice Diagnostics Dashboard</h1>
            <p className="text-xs font-semibold text-text-slate">Detailed performance breakdown across the 4 core testing fields.</p>
          </div>
          <button
            onClick={() => setTestState('intro')}
            className="px-5 py-2.5 border border-border-slate hover:bg-surface-slate rounded-xl text-xs font-bold text-navy-950 transition-all self-start sm:self-center"
          >
            Go Back
          </button>
        </div>

        {/* Top Summary Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="premium-card bg-white border border-border-slate p-6 flex justify-between items-center shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-slate uppercase tracking-wider block">Aggregate Score</span>
              <h2 className="font-outfit font-black text-3xl text-navy-950">{res.score} <span className="text-lg font-bold text-text-slate">/ 20</span></h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-800/5 text-blue-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="premium-card bg-white border border-border-slate p-6 flex justify-between items-center shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-slate uppercase tracking-wider block">Accuracy level</span>
              <h2 className="font-outfit font-black text-3xl text-success-green">{res.accuracy}%</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-green/5 text-success-green flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="premium-card bg-white border border-border-slate p-6 flex justify-between items-center shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-slate uppercase tracking-wider block">Time Elapsed</span>
              <h2 className="font-outfit font-black text-3xl text-navy-950">{res.timeTaken}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-navy-950/5 text-navy-950 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Domain performance breakdown charting */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-8 premium-card bg-white border border-border-slate p-6 space-y-6 shadow-sm">
            <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3 flex items-center gap-2">
              <BarChart2 className="w-4.5 h-4.5 text-blue-800" />
              Syllabus Performance Diagnostics
            </h4>
            
            <div className="h-[260px] w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                  <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                    contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '11px' }} 
                  />
                  <Bar dataKey="Score" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#0B1F3A' : index === 1 ? '#1E4D8C' : index === 2 ? '#D4A017' : '#16A34A'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 premium-card bg-white border border-border-slate p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <h4 className="font-outfit font-extrabold text-sm text-navy-950 border-b border-border-slate/60 pb-3">
                Advisory & Feedback
              </h4>
              
              <div className="space-y-3.5 text-xs leading-relaxed font-semibold text-text-slate">
                {res.score >= 15 ? (
                  <>
                    <p className="text-navy-950 font-bold">Excellent Readiness!</p>
                    <p className="text-[11px]">
                      Your conceptual readiness is highly optimized. You have cleared the qualifying margins comfortably. Maintain this research methodologies revision for the main exam!
                    </p>
                  </>
                ) : res.score >= 10 ? (
                  <>
                    <p className="text-navy-950 font-bold">Moderate Readiness</p>
                    <p className="text-[11px]">
                      You possess strong general verbal capabilities, but quantitative aptitude or research methodology require some study review. Dedicate time to revise sampling procedures.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-error-red font-bold">Review Syllabus Required</p>
                    <p className="text-[11px]">
                      Your results indicate gaps in research methodology concepts and logical deduction parameters. Focus on fundamental statistics and attempt another practice session before August.
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleStartTest}
              className="w-full text-center py-3 bg-navy-950 hover:bg-blue-800 text-white font-extrabold rounded-xl transition-all text-xs mt-6 shadow-sm"
            >
              Re-Attempt Practice Test
            </button>
          </div>

        </div>

      </div>
    );
  }
}
