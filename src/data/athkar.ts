// src/data/athkar.ts
import type { Athkar } from '@/types';

// Standardized keys (used for routing and storage)
export const MORNING_KEY = 'morning';
export const EVENING_KEY = 'evening';
export const AFTER_PRAYER_KEY = 'afterPrayer';
export const SLEEP_KEY = 'sleep';

// ----- Athkar Definitions -----

// Morning Athkar
export const morningAthkar: Athkar[] = [
  {
    id: 'm1',
    category: MORNING_KEY,
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    count: 1,
    reference: 'مسلم',
  },
  {
    id: 'm2',
    category: MORNING_KEY,
    text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.',
    count: 1,
    reference: 'الترمذي',
  },
  {
    id: 'm3',
    category: MORNING_KEY,
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.',
    count: 3,
    reference: 'مسلم',
  },
    {
    id: 'm4',
    category: MORNING_KEY,
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    count: 3,
    reference: 'أبو داود والترمذي',
  },
  {
    id: 'm5',
    category: MORNING_KEY,
    text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ.',
    count: 3,
    reference: 'أبو داود',
  },
  {
    id: 'm6',
    category: MORNING_KEY,
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.',
    count: 3,
    reference: 'أبو داود',
  },
  {
    id: 'm7',
    category: MORNING_KEY,
    text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.',
    count: 1,
    reference: 'الحاكم',
  }
];

// Evening Athkar
export const eveningAthkar: Athkar[] = [
  {
    id: 'e1',
    category: EVENING_KEY,
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
    count: 1,
    reference: 'مسلم',
  },
  {
    id: 'e2',
    category: EVENING_KEY,
    text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.',
    count: 1,
    reference: 'الترمذي',
  },
    {
    id: 'e3',
    category: EVENING_KEY,
    text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.',
    count: 3,
    reference: 'مسلم',
  },
   {
    id: 'e4',
    category: EVENING_KEY,
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.',
    count: 3,
    reference: 'أبو داود والترمذي',
  },
  {
    id: 'e5',
    category: EVENING_KEY,
    text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ.',
    count: 3,
    reference: 'أبو داود',
  },
  {
    id: 'e6',
    category: EVENING_KEY,
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.',
    count: 3,
    reference: 'أبو داود',
  },
];

// After Prayer Athkar
export const afterPrayerAthkar: Athkar[] = [
    { id: 'p1', category: AFTER_PRAYER_KEY, text: 'أَسْتَغْفِرُ اللَّهَ', count: 3, reference: 'مسلم'},
    { id: 'p2', category: AFTER_PRAYER_KEY, text: 'اللَّهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالْإِكْرَامِ.', count: 1, reference: 'مسلم'},
    { id: 'p3', category: AFTER_PRAYER_KEY, text: 'سُبْحَانَ اللَّهِ', count: 33, reference: 'متفق عليه'},
    { id: 'p4', category: AFTER_PRAYER_KEY, text: 'الْحَمْدُ لِلَّهِ', count: 33, reference: 'متفق عليه'},
    { id: 'p5', category: AFTER_PRAYER_KEY, text: 'اللَّهُ أَكْبَرُ', count: 33, reference: 'متفق عليه'},
    { id: 'p6', category: AFTER_PRAYER_KEY, text: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.', count: 1, reference: 'متفق عليه'},
];

// Sleep Athkar
export const sleepAthkar: Athkar[] = [
    { id: 's1', category: SLEEP_KEY, text: 'بِاسْمِكَ رَبِّ وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.', count: 1, reference: 'متفق عليه'},
    { id: 's2', category: SLEEP_KEY, text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.', count: 3, reference: 'أبو داود'},
    { id: 's3', category: SLEEP_KEY, text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.', count: 1, reference: 'البخاري'},
];

// ----- Library and Master List Structure -----

// Interface for the structure returned by getAthkarListByCategory
export interface AthkarListData {
    title: string;
    list: Athkar[];
    storageKey: string; // Key used for storing completion state in localStorage
}

// Master map containing all predefined and library categories
const allCategoryData: Record<string, AthkarListData> = {
    [MORNING_KEY]: {
        title: "أذكار الصباح",
        list: morningAthkar,
        storageKey: 'morning_completed_v1' // Keep original storage key for defaults
    },
    [EVENING_KEY]: {
        title: "أذكار المساء",
        list: eveningAthkar,
        storageKey: 'evening_completed_v1' // Keep original storage key for defaults
    },
    [AFTER_PRAYER_KEY]: {
        title: "أذكار ما بعد الصلاة",
        list: afterPrayerAthkar,
        storageKey: `custom_list_completed_${AFTER_PRAYER_KEY}` // Prefix for custom lists
    },
    [SLEEP_KEY]: {
        title: "أذكار النوم",
        list: sleepAthkar,
        storageKey: `custom_list_completed_${SLEEP_KEY}` // Prefix for custom lists
    },
    // Add other categories here in the future if needed, e.g.:
    // wakingUp: { title: "أذكار الاستيقاظ", list: wakingUpAthkar, storageKey: 'custom_list_completed_wakingUp' },
};

// Structure for the library page - only includes lists meant for the library
export const libraryCategories: Record<string, { title: string; list: Athkar[] }> = {
  [AFTER_PRAYER_KEY]: { title: allCategoryData[AFTER_PRAYER_KEY].title, list: allCategoryData[AFTER_PRAYER_KEY].list },
  [SLEEP_KEY]: { title: allCategoryData[SLEEP_KEY].title, list: allCategoryData[SLEEP_KEY].list },
  // Add other *library-specific* categories here
};

// Function to get Athkar list data by category key
export function getAthkarListByCategory(categoryKey: string): AthkarListData | null {
  return allCategoryData[categoryKey] || null;
}

// Combine ALL Athkar from all defined lists for potential other uses (e.g., search)
export const allAthkar = Object.values(allCategoryData).flatMap(data => data.list);
