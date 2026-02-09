import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  if (!apiKey) {
    return "API Key tidak ditemukan. Silakan konfigurasi environment variable.";
  }

  const transactionSummary = transactions.map(t => 
    `- ${t.date}: ${t.description} (${t.category}) | Rp ${t.amount.toLocaleString()} | ${t.type}`
  ).join('\n');

  const prompt = `
    Anda adalah konsultan keuangan profesional khusus untuk agensi desain dan freelancer kreatif.
    Analisis data transaksi berikut dan berikan 3 saran strategis singkat (dalam format bullet point) untuk meningkatkan profitabilitas dan efisiensi arus kas.
    Gunakan Bahasa Indonesia yang profesional namun mudah dimengerti.
    
    Data Transaksi:
    ${transactionSummary}
    
    Berikan saran fokus pada:
    1. Pola pengeluaran yang bisa dihemat (misal software subscription).
    2. Peluang cashflow (misal termin pembayaran).
    3. Kesehatan keuangan secara umum.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return "Maaf, terjadi kesalahan saat menghubungi asisten AI.";
  }
};

export const generateBriefDraft = async (topic: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  
  const prompt = `
    Buatkan kerangka Brief Desain profesional untuk proyek dengan topik: "${topic}".
    
    Berikan output dalam format teks biasa (plain text) dengan struktur:
    1. Tujuan Proyek
    2. Target Audience
    3. Tone & Style Visual
    4. Key Deliverables (misal: Logo, Banner, IG Post)
    
    Gunakan bahasa Indonesia yang profesional ala agency kreatif.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Gagal membuat brief.";
  } catch (error) {
    console.error("Error generating brief:", error);
    return "Terjadi kesalahan saat membuat brief.";
  }
};