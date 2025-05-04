// src/data/athkar.ts
import type { Athkar } from '@/types';

// IMPORTANT: Replace this with a comprehensive and verified list of Athkar.
// These are just a few examples for demonstration.

export const morningAthkar: Athkar[] = [
  {
    id: 'm1',
    category: 'Morning',
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    count: 1,
    reference: 'مسلم',
  },
  {
    id: 'm2',
    category: 'Morning',
    text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.',
    count: 1,
    reference: 'الترمذي',
  },
  {
    id: 'm3',
    category: 'Morning',
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.',
    count: 3,
    reference: 'مسلم',
  },
    {
    id: 'm4',
    category: 'Morning',
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    count: 3,
    reference: 'أبو داود والترمذي',
  },
];

export const eveningAthkar: Athkar[] = [
  {
    id: 'e1',
    category: 'Evening',
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    count: 1,
    reference: 'مسلم',
  },
  {
    id: 'e2',
    category: 'Evening',
    text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.',
    count: 1,
    reference: 'الترمذي',
  },
    {
    id: 'e3',
    category: 'Evening',
    text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
    count: 3,
    reference: 'مسلم',
  },
   {
    id: 'e4',
    category: 'Evening',
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    count: 3,
    reference: 'أبو داود والترمذي',
  },
];

// Add other categories as needed (e.g., After Prayer, Sleep)
export const allAthkar = [...morningAthkar, ...eveningAthkar];
