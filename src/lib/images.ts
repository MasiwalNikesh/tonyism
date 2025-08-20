import { Testimony } from "./search";

// Image configuration
export interface TestimonyImage {
  id: string;
  testimonyId: string;
  src: string;
  alt: string;
  caption?: string;
  isProfile?: boolean;
  width?: number;
  height?: number;
}

// Default placeholder for missing images
export const DEFAULT_AVATAR_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23f3f4f6'/%3E%3Cpath d='M50 30c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15zm0 40c-16.569 0-30 13.431-30 30v5h60v-5c0-16.569-13.431-30-30-30z' fill='%236b7280'/%3E%3C/svg%3E";

/**
 * Parse image filename to extract metadata
 * Pattern: PageNumber_SectionTitle_SectionPageNumber_PhotoNumber.ext
 */
export function parseImageFilename(filename: string): {
  pageNumber: number;
  sectionTitle: string;
  sectionPage: number;
  photoNumber: number;
  extension: string;
} | null {
  const match = filename.match(/^(\d+)_(.+?)_(\d+)_(\d+)\.(jpg|png)$/);
  if (!match) return null;

  const [, pageNumber, sectionTitle, sectionPage, photoNumber, extension] =
    match;

  return {
    pageNumber: parseInt(pageNumber),
    sectionTitle: sectionTitle.replace(/_/g, " "),
    sectionPage: parseInt(sectionPage),
    photoNumber: parseInt(photoNumber),
    extension,
  };
}

// Complete list of all available images
const ALL_IMAGES = [
  "0_Cover_1.jpg",
  "1_Collage_1.jpg",
  "1_collage_2.jpg",
  "1_collage_3.jpg",
  "1_collage_4 (top left pic only).jpg",
  "2_collage_1.jpg",
  "2_collage_2.jpg",
  "2_collage_3.jpg",
  "2_collage_4.jpg",
  "2_collage_5.jpg",
  "2_collage_6.jpg",
  "2_collage_7.jpg",
  "4_Foreword_1_1.png",
  "5_Foreword_2_1.png",
  "5_Foreword_2_2.png",
  "5_Foreword_2_3.png",
  "7_Collage_1.jpg",
  "7_Collage_2.jpg",
  "7_Collage_3.jpg",
  "7_Collage_4.jpg",
  "7_Collage_5.jpg",
  "7_Collage_6.jpg",
  "7_Collage_7.jpg",
  "7_Collage_8.jpg",
  "7_Collage_9.jpg",
  "7_Collage_10.jpg",
  "7_Collage_11.jpg",
  "7_Collage_12.jpg",
  "7_Collage_13.jpg",
  "7_Collage_14.jpg",
  "7_Collage_15.jpg",
  "8_Hum Do Humare Char_1_1.jpg",
  "8_Hum Do Humare Char_1_2.jpg",
  "8_Hum Do Humare Char_1_3.jpg",
  "9_Hum Do Humare Char_2_1.jpg",
  "9_Hum Do Humare Char_2_2.jpg",
  "9_Hum Do Humare Char_2_3.jpg",
  "9_Hum Do Humare Char_2_4.jpg",
  "9_Hum Do Humare Char_2_5.jpg",
  "9_Hum Do Humare Char_2_6.jpg",
  "10_Hum Do Humare Char_3_1.png",
  "11_Hum Do Humare Char_4_1.jpg",
  "11_Hum Do Humare Char_4_2.jpg",
  "11_Hum Do Humare Char_4_3.jpg",
  "11_Hum Do Humare Char_4_4.jpg",
  "12_Hum Do Humare Char_5_1.jpg",
  "12_Hum Do Humare Char_5_2.jpg",
  "12_Hum Do Humare Char_5_3.jpg",
  "12_Hum Do Humare Char_5_4.jpg",
  "12_Hum Do Humare Char_5_5.jpg",
  "12_Hum Do Humare Char_5_6.jpg",
  "13_Hum Do Humare Char_6_1.jpg",
  "13_Hum Do Humare Char_6_2.jpg",
  "13_Hum Do Humare Char_6_3.jpg",
  "13_Hum Do Humare Char_6_4.jpg",
  "13_Hum Do Humare Char_6_5.jpg",
  "14_Hum Do Humare Char_7_1.jpg",
  "14_Hum Do Humare Char_7_2.jpg",
  "14_Hum Do Humare Char_7_3.jpg",
  "14_Hum Do Humare Char_7_4.jpg",
  "15_Hum Do Humare Char_8_1.jpg",
  "15_Hum Do Humare Char_8_2.jpg",
  "15_Hum Do Humare Char_8_3.jpg",
  "15_Hum Do Humare Char_8_4.jpg",
  "15_Hum Do Humare Char_8_5.jpg",
  "16_Hum Do Humare Char_9_1.jpg",
  "16_Hum Do Humare Char_9_2.jpg",
  "16_Hum Do Humare Char_9_3.jpg",
  "16_Hum Do Humare Char_9_4.jpg",
  "16_Hum Do Humare Char_9_5.jpg",
  "16_Hum Do Humare Char_9_6.jpg",
  "17_Hum Do Humare Char_10_1.jpg",
  "17_Hum Do Humare Char_10_2.jpg",
  "17_Hum Do Humare Char_10_3.jpg",
  "17_Hum Do Humare Char_10_4.jpg",
  "17_Hum Do Humare Char_10_5.jpg",
  "17_Hum Do Humare Char_10_6.jpg",
  "18_Hum Do Humare Char_11_1.jpg",
  "18_Hum Do Humare Char_11_2.jpg",
  "18_Hum Do Humare Char_11_3.jpg",
  "18_Hum Do Humare Char_11_4.jpg",
  "18_Hum Do Humare Char_11_5.jpg",
  "18_Hum Do Humare Char_11_6.jpg",
  "18_Hum Do Humare Char_11_7.jpg",
  "18_Hum Do Humare Char_11_8.jpg",
  "18_Hum Do Humare Char_11_9.jpg",
  "18_Hum Do Humare Char_11_10.jpg",
  "19_Hum Do Humare Char_12_1.jpg",
  "19_Hum Do Humare Char_12_2.jpg",
  "19_Hum Do Humare Char_12_3.jpg",
  "19_Hum Do Humare Char_12_4.jpg",
  "19_Hum Do Humare Char_12_5.jpg",
  "19_Hum Do Humare Char_12_6.jpg",
  "20_Hum Do Humare Char_13_1.jpg",
  "20_Hum Do Humare Char_13_2.jpg",
  "20_Hum Do Humare Char_13_3.jpg",
  "20_Hum Do Humare Char_13_4.jpg",
  "21_Jaahi Vidhi Raakhe Ram_1_1.jpg",
  "21_Jaahi Vidhi Raakhe Ram_1_2.jpg",
  "22_Devotion_1_1.jpg",
  "22_Devotion_1_2.jpg",
  "22_Devotion_1_3.jpg",
  "22_Devotion_1_4.jpg",
  "22_Devotion_1_5.jpg",
  "22_Devotion_1_6.jpg",
  "22_Devotion_1_7.jpg",
  "24_The Best of All of Us_1_1.jpg",
  "24_The Best of All of Us_1_2.jpg",
  "25_The Best of All of Us_2_1.jpg",
  "26_A Tribute to Tony_1_1.jpg",
  "26_A Tribute to Tony_1_2.jpg",
  "26_A Tribute to Tony_1_3.jpg",
  "27_A Tribute to Tony_2_1.jpg",
  "27_A Tribute to Tony_2_2.jpg",
  "27_A Tribute to Tony_2_3.jpg",
  "27_A Tribute to Tony_2_4.jpg",
  "28_Mera Tony_1_1.jpg",
  "28_Mera Tony_1_2.jpg",
  "28_Mera Tony_1_3.jpg",
  "29_Mera Tony_2_1.jpg",
  "29_Mera Tony_2_2.jpg",
  "29_Mera Tony_2_4.jpg",
  "30_Geeta Sachdeva_1_1.jpg",
  "30_Geeta Sachdeva_1_2.jpg",
  "30_Geeta Sachdeva_1_3.jpg",
  "31_Geeta Sachdeva_2_1.jpg",
  "31_Geeta Sachdeva_2_2.jpg",
  "31_Geeta Sachdeva_2_3.jpg",
  "31_Geeta Sachdeva_2_4.jpg",
  "32_Uncle by blood, brother by bond_1_1.jpg",
  "33_Uncle by blood, brother by bond_2_1.jpg",
  "33_Uncle by blood, brother by bond_2_2.jpg",
  "34_Mrs Shashi Mutreja_1_1.jpg",
  "35_Mrs Harbans Diwan_1_1.jpg",
  "35_Mrs Harbans Diwan_1_2.jpg",
  "36_Tony Beta_1_1.jpg",
  "36_Tony Beta_1_2.jpg",
  "36_Tony Beta_1_3.jpg",
  "36_Tony Beta_1_4.jpg",
  "37_Tonyism_ Bringing Families Together_1_1.jpg",
  "37_Tonyism_ Bringing Families Together_1_2.jpg",
  "37_Tonyism_ Bringing Families Together_1_3.jpg",
  "37_Tonyism_ Bringing Families Together_1_4.jpg",
  "39_Bingo_1_1.jpg",
  "39_Bingo_1_2.jpg",
  "39_Bingo_1_3.jpg",
  "39_Bingo_1_4.jpg",
  "39_Bingo_1_5.jpg",
  "40_Adventures of Tony and Pinky_1_1.png",
  "40_Adventures of Tony and Pinky_1_2.png",
  "40_Adventures of Tony and Pinky_1_3.png",
  "41_Adventures of Tony and Pinky_2_1.jpg",
  "41_Adventures of Tony and Pinky_2_2.jpg",
  "41_Adventures of Tony and Pinky_2_3.jpg",
  "42_A Double Date in 1988_1_1.jpg",
  "42_A Double Date in 1988_1_2.jpg",
  "42_A Double Date in 1988_1_3.jpg",
  "42_A Double Date in 1988_1_4.jpg",
  "43_A Man of Surprises_1_1.jpg",
  "43_A Man of Surprises_1_2.jpg",
  "43_A Man of Surprises_1_3.jpg",
  "43_A Man of Surprises_1_4.jpg",
  "44_Blessings to Tony_1_1.jpg",
  "44_Blessings to Tony_1_2.jpg",
  "44_Blessings to Tony_1_3.jpg",
  "44_Blessings to Tony_1_4.jpg",
  "45_Bimla Pruthi_1_1.jpg",
  "45_Bimla Pruthi_1_2.jpg",
  '46_"Doctor Sahab"_1_1.jpg',
  '46_"Doctor Sahab"_1_2.jpg',
  '46_"Doctor Sahab"_1_3.jpg',
  '46_"Doctor Sahab"_1_4.jpg',
  "47_The Best Jadoo ki Jhuppy_1_1.jpg",
  "48_Sushma Khanna_1_1.png",
  "49_Sushma Khanna_2_1.jpg",
  "49_Sushma Khanna_2_2.jpg",
  "49_Sushma Khanna_2_3.png",
  '50_"Bathroom Mein Chhup Ja"_1_1jpg.jpg',
  '51_"Bathroom Mein Chhup Ja"_2_1.jpg',
  '51_"Bathroom Mein Chhup Ja"_2_2.jpg',
  '51_"Bathroom Mein Chhup Ja"_2_3.jpg',
  '52_"A Legacy of Love and Loyalty"_1_1.jpg',
  '52_"A Legacy of Love and Loyalty"_1_2.jpg',
  '52_"A Legacy of Love and Loyalty"_1_3.jpg',
  '52_"A Legacy of Love and Loyalty"_1_4.jpg',
  "53_Savita Khattar_1_1.jpg",
  "54_Rashmi Verma_1_1.jpg",
  '55_"My Go-To Person"_1_1.jpg',
  "56_Tony Chacha_1_1.jpg",
  "56_Tony Chacha_1_2.jpg",
  "56_Tony Chacha_1_3.jpg",
  "57_Savita and Praveen_1_1.jpg",
  "57_Savita and Praveen_1_2.jpg",
  "57_Savita and Praveen_1_3.jpg",
  "57_Savita and Praveen_1_4.jpg",
  "58_A beacon of hope and positivity_1_1.jpg",
  '59_"A Rare Soul"_1_1.jpg',
  "60_Kamla Masiwal_1_1.jpg",
  "60_Kamla Masiwal_1_2.jpg",
  "61_Mohan Masiwal_1_1.jpg",
  "61_Mohan Masiwal_1_2.jpg",
  "61_Mohan Masiwal_1_3.jpg",
  "61_Mohan Masiwal_1_4.jpg",
  "62_Dear Tony Bhaiya_1_1.jpg",
  "62_Dear Tony Bhaiya_1_2.jpg",
  "63_My Dear Brother Tony_1_1.jpg",
  "63_My Dear Brother Tony_1_2.jpg",
  "63_My Dear Brother Tony_1_3.jpg",
  "64_Poonam (Mumbai)_1_1.jpg",
  "64_Poonam (Mumbai)_1_2.jpg",
  "65_Mere Pyaare Tony Bhai_1_1.jpg",
  "65_Mere Pyaare Tony Bhai_1_2.jpg",
  "65_Mere Pyaare Tony Bhai_1_3.jpg",
  "66_In Remembrance_1_1.jpg",
  "66_In Remembrance_1_2.jpg",
  "66_Zest_1_1.jpg",
  "66_Zest_1_2.jpg",
  "66_Zest_1_4.jpg",
  "66_Zest_1_4(1).jpg",
  "66_Zest_1_5.jpg",
  "66_Zest_1_6.png",
  "66_Zest_1_8.JPG",
  "66_Zest_1_10.JPG",
  "66_Zest_2_1.JPG",
  "67_zest_1_1.jpeg",
  "67_zest_1_2.jpeg",
  "67_zest_1_3.jpg",
  "67_zest_1_4.jpg",
  "67_zest_1_5.jpg",
  "71_The Adventures of Petha and Mufali_1_1.png",
  "71_The Adventures of Petha and Mufali_1_2.png",
  "73_A Tribute to GK Batra (Tony Bhaiya)_2_1.png",
  "74_A Bridge of Hearts_1_1.jpg",
  "76_Friendship that endured the test of time_1_1.png",
  "76_Friendship that endured the test of time_1_2.jpg",
  "76_Friendship that endured the test of time_1_3.jpg",
  "76_Friendship that endured the test of time_1_4.jpg",
  "77_Batra Uncle!!_1_1.jpg",
  "77_Batra Uncle!!_1_2.jpg",
  "78_”A legacy of compassion and love_1_1.jpg",
  "78_”A legacy of compassion and love_1_2.jpg",
  "79_M R Raman_1_1.jpg",
  "80_Rishi Pal Singh_1.jpg",
  "81_Shree Shankar Swami_1_1.jpg",
  "82_Vinod Gupta_1_1.jpg",
  "82_Vinod Gupta_1_2.jpg",
  "82_Vinod Gupta_1_3.jpg",
  "82_Vinod Gupta_1_4.jpg",
  "83_Arun_1_1.jpg",
  "86_Tony-ism Generosity_1_1.jpg",
  "91_Atul_1_1.jpg",
  "92_Super Bhakt_1_1.jpg",
  "93_Gone from sight_1_1.jpg",
  "93_Gone from sight_1_2.jpg",
  "94_Raj Seth_1_1.jpg",
  "94_Saroj Julka_1_2.jpg",
  "98_Aur Beta Sab Theek_1_1.jpg",
  "98_Aur Beta Sab Theek_1_2.jpg",
  "98_Aur Beta Sab Theek_1_3.jpg",
  "99_My First Ever Black Label Bottle_1_1.jpg",
  "99_My First Ever Black Label Bottle_1_2.jpg",
  "99_My First Ever Black Label Bottle_1_3.jpg",
  "99_My First Ever Black Label Bottle_1_4.jpg",
  "99_My First Ever Black Label Bottle_1_5.jpg",
  "100_The Unforgettable Embrace_1_1.jpeg",
  "101_The Unforgettable Embrace_2_1.jpg",
  "102_”A wholesome Person”_1_1.jpg",
  "102_”A wholesome Person”_1_2.jpg",
  "102_”A wholesome Person”_1_3.jpg",
  "102_”A wholesome Person”_1_4.jpg",
  "103_A Father Figure_1_1.jpg",
  "103_A Father Figure_1_2.jpg",
  "103_A Father Figure_1_3.jpg",
  "103_A Father Figure_1_4.jpg",
  "103_A Father Figure_1_5.jpg",
  "104_A heart of gold_1_1.jpg",
  "104_A heart of gold_1_2.jpg",
  "104_A heart of gold_1_3.jpg",
  "105_Ekta Batra Chopra_1_1.jpg",
  "105_Ekta Batra Chopra_1_2.jpg",
  "105_Ekta Batra Chopra_1_3.jpg",
  "105_Ekta Batra Chopra_1_4.jpg",
  "105_Ekta Batra Chopra_1_5.jpeg",
  "106_Dr Manisha Sachdeva_1_1.jpg",
  "106_Dr Manisha Sachdeva_1_2.jpg",
  "106_Dr Manisha Sachdeva_1_3.jpg",
  "107_Dr Manisha Sachdeva_2_1.jpg",
  "107_Dr Manisha Sachdeva_2_2.jpg",
  "107_Dr Manisha Sachdeva_2_3.jpg",
  "108_To live selflessly and love unconditionally_1_1.jpg",
  "108_To live selflessly and love unconditionally_1_2.jpg",
  "108_To live selflessly and love unconditionally_1_3.jpg",
  "109_My very fond memories of tony mamaji_1_1.jpg",
  "109_My very fond memories of tony mamaji_1_2.jpg",
  "110_Rajan Sethi_1_1.jpg",
  "110_Rajan Sethi_1_2.jpg",
  "111_Mukaish ki Saree_1_1.jpg",
  "111_Mukaish ki Saree_1_2.jpg",
  "112_My Ode to the Man who loved_1_1.jpg",
  "112_My Ode to the Man who loved_1_2.jpg",
  "112_My Ode to the Man who loved_1_3.jpg",
  "112_My Ode to the Man who loved_1_4.jpg",
  "113_My Ode to the Man who loved_2_1.jpg",
  "113_My Ode to the Man who loved_2_2.jpg",
  "113_My Ode to the Man who loved_2_3.jpg",
  "113_My Ode to the Man who loved_2_4.jpg",
  "114_Saryu Khanna_1_1.jpg",
  "114_Saryu Khanna_1_2.jpg",
  "114_Saryu Khanna_1_3.jpg",
  "115_See You Again_1_1.jpg",
  "115_See You Again_1_2.jpg",
  "115_See You Again_1_3.jpg",
  "116_Main Hoon Na_1_1.jpg",
  "116_Main Hoon Na_1_2.jpg",
  "116_Main Hoon Na_1_3.jpg",
  "116_Main Hoon Na_1_4.jpg",
  "117_Main Hoon Na_2_1.jpg",
  "117_Main Hoon Na_2_2.jpg",
  "118_Santa Claus Chachu_1_1.jpg",
  "118_Santa Claus Chachu_1_2.jpg",
  "118_Santa Claus Chachu_1_3.jpg",
  "118_Santa Claus Chachu_1_4.jpg",
  "119_Tarun Sachdeva_1_1.jpeg",
  "119_Tarun Sachdeva_1_2.jpg",
  "119_Tarun Sachdeva_1_3.jpg",
  "119_Tarun Sachdeva_1_4.jpg",
  "119_Tarun Sachdeva_1_5.jpg",
  "119_Tarun Sachdeva_1_6.jpg",
  "119_Tarun Sachdeva_1_7.jpg",
  "120_Dearest Chachu_1_1.jpg",
  "120_Dearest Chachu_1_2.jpg",
  "120_Dearest Chachu_1_3.jpg",
  "121_Dearest Chachu_2_1.pg",
  "121_Dearest Chachu_2_2.jpg",
  "121_Dearest Chachu_2_3.jpg",
  "122_To our dearest Tony chachu_1_1.jpg",
  "123_love for food_1_2.jpg",
  "123_love for food_1_3.jpg",
  "123_love for food_1_4.jpg",
  "123_love for food_1_5.jpg",
  "123_love for food_1_6.jpg",
  "123_Love for food_1.jpg",
  "123_Tony Uncle_1_1.jpg",
  "123_Tony Uncle_1_2.jpg",
  "124_love for feeding_1_1.jpg",
  "124_love for feeding_1_2.jpg",
  "124_love for feeding_1_3.jpg",
  "124_love for feeding_1_4.jpg",
  "124_love for feeding_1_5.jpg",
  "124_love for feeding_1_6.jpg",
  "125_Tonys Kitchen_1_1.png",
  "125_Tonys Kitchen_1_2.jpg",
  "125_Tonys Kitchen_1_3.png",
  "125_Tonys Kitchen_1_4.png",
  "126_Dry fruit namkeen_1_1.jpg",
  "126_Dry fruit namkeen_1_2.jpg",
  "127_Laddu sehat wala_1_1.jpg",
  "127_Laddu sehat wala_1_2.jpg",
  "128_Besan barfi_1_1.jpg",
  "128_besan barfi_1_2.jpg",
  "129_baingan ka bharta_1_1.png",
  "131_collage_1_1.jpg",
  "131_collage_1_2.jpg",
  "131_collage_1_3.jpg",
  "131_collage_1_4.jpg",
  "131_collage_1_5.jpg",
  "131_collage_1_6.jpg",
  "131_collage_1_7.jpg",
  "131_collage_1_8.jpg",
  "131_collage_1_9.jpg",
  "131_collage_1_10.png",
  "132_collage_1_1.jpg",
  "132_collage_1_2.jpg",
  "132_collage_1_3.jpg",
  "132_collage_1_4.jpg",
  "132_collage_1_5.jpg",
  "132_collage_1_6.jpg",
  "132_collage_1_7.jpg",
  "133_elephant king_1_1.png",
  "133_elephant king_1_2.png",
  "133_elephant king_1_3.jpg",
  "133_elephant king_1_4.png",
  "133_elephant king_1_5.png",
  "133_elephant king_1_6.png",
  "133_elephant king_1_7.jpeg",
  "133_elephant king_1_8.jpeg",
  "135_Tony nana is the best nana ever_1_1.jpg",
  "135_Tony nana is the best nana ever_1_2.jpg",
  "136_dev Dear nanu_1_1.jpg",
  "136_dev Dear nanu_1_2.jpg",
  "136_dev Dear nanu_1_3.jpg",
  "136_dev Dear nanu_1_4.jpg",
  "136_dev Dear nanu_1_5.jpg",
  "137_eshika chopra_1_1.jpg",
  "137_eshika chopra_1_2.jpg",
  "137_eshika chopra_1_3.jpg",
  "137_eshika chopra_1_4.jpg",
  "137_eshika chopra_1_5.jpg",
  "137_eshika chopra_1_6.png",
  "138_khushi arora_1_1.png",
  "138_khushi arora_1_2.png",
  "138_khushi arora_1_3.jpg",
  "138_khushi arora_1_4.jpg",
  "138_khushi arora_1_5.jpg",
  "138_khushi arora_1_6.jpg",
  "139_suhaani chopra_1_1.jpg",
  "139_suhaani chopra_1_2.jpg",
  "139_suhaani chopra_1_3.jpg",
  "139_suhaani chopra_1_4.jpg",
  "139_suhaani chopra_1_5.jpg",
  "139_suhaani chopra_1_6.jpg",
  "141_epilogue1_1.jpg",
  "143_tonyism_1_1.jpg",
];

/**
 * Get images for a specific page number
 */
export function getImagesForPageNumber(pageNumber: number): string[] {
  return ALL_IMAGES.filter((filename) => {
    const parsed = parseImageFilename(filename);
    return parsed && parsed.pageNumber === pageNumber;
  })
    .map((filename) => `/images/testimonies/${filename}`)
    .sort();
}

/**
 * Get images for a range of page numbers
 */
export function getImagesForPageRange(
  startPage: number,
  endPage: number
): string[] {
  const images: string[] = [];
  for (let page = startPage; page <= endPage; page++) {
    images.push(...getImagesForPageNumber(page));
  }
  return images;
}

/**
 * Get images for a specific story based on its page number
 */
export function getImagesForStoryPage(pageNumber: number): string[] {
  return getImagesForPageNumber(pageNumber);
}

/**
 * Get images for a specific section/story (legacy function)
 */
export function getImagesForSection(sectionTitle: string): TestimonyImage[] {
  const normalizedSectionTitle = sectionTitle
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  const images = ALL_IMAGES.map((filename) => {
    const parsed = parseImageFilename(filename);
    if (!parsed) return null;

    const {
      pageNumber,
      sectionTitle: imgSectionTitle,
      sectionPage,
      photoNumber,
    } = parsed;

    // Check if this image belongs to the requested section
    if (!imgSectionTitle.toLowerCase().includes(normalizedSectionTitle))
      return null;

    return {
      id: filename.replace(/\.(jpg|png)$/, ""),
      testimonyId: sectionTitle.toLowerCase().replace(/\s+/g, "-"),
      src: `/images/testimonies/${filename}`,
      alt: `${sectionTitle} - Photo ${photoNumber}`,
      caption: `Page ${pageNumber}, Section ${sectionPage}`,
      width: 600,
      height: 400,
    };
  })
    .filter((img) => img !== null) as TestimonyImage[];
  
  return images
    .sort((a, b) => {
      const aPage = parseImageFilename(a.src.split("/").pop() || "");
      const bPage = parseImageFilename(b.src.split("/").pop() || "");
      if (!aPage || !bPage) return 0;

      if (aPage.sectionPage !== bPage.sectionPage) {
        return aPage.sectionPage - bPage.sectionPage;
      }
      return aPage.photoNumber - bPage.photoNumber;
    });
}

/**
 * Get collage images (general family photos)
 */
export function getCollageImages(): TestimonyImage[] {
  const collageFiles = [
    "1_Collage_1.jpg",
    "1_collage_2.jpg",
    "1_collage_3.jpg",
    "2_collage_1.jpg",
    "2_collage_2.jpg",
    "2_collage_3.jpg",
    "2_collage_4.jpg",
    "2_collage_5.jpg",
    "2_collage_6.jpg",
    "2_collage_7.jpg",
    "7_Collage_1.jpg",
    "7_Collage_2.jpg",
    "7_Collage_3.jpg",
    "7_Collage_4.jpg",
    "7_Collage_5.jpg",
    "7_Collage_6.jpg",
    "7_Collage_7.jpg",
    "7_Collage_8.jpg",
    "7_Collage_9.jpg",
    "7_Collage_10.jpg",
    "7_Collage_11.jpg",
    "7_Collage_12.jpg",
    "7_Collage_13.jpg",
    "7_Collage_14.jpg",
    "7_Collage_15.jpg",
  ];

  return collageFiles.map((filename, index) => ({
    id: filename.replace(/\.(jpg|png)$/, ""),
    testimonyId: "collage",
    src: `/images/testimonies/${filename}`,
    alt: `Family photo collage ${index + 1}`,
    caption: `Family memories`,
    width: 400,
    height: 400,
  }));
}

/**
 * Get images for a story based on its page number from magazine
 */
export function getImagesForStoryByPage(storyPage: number): string[] {
  return getImagesForPageNumber(storyPage);
}

/**
 * Map magazine page to story images
 */
export function getImagesForMagazineStory(
  storyTitle: string,
  storyPage: number
): string[] {
  // First try to get images by specific page number
  const pageImages = getImagesForPageNumber(storyPage);

  // If no images found by page number, try by section title as fallback
  if (pageImages.length === 0) {
    const sectionImages = getImagesForSection(storyTitle);
    return sectionImages.map((img) => img.src);
  }

  return pageImages;
}

// Image mappings using the actual files
const imageMap: Record<string, TestimonyImage[]> = {
  foreword: getImagesForSection("Foreword"),
  "hum-do-humare-char": getImagesForSection("Hum Do Humare Char"),
  collage: getCollageImages(),
};

/**
 * Get images for a specific testimony
 */
export function getTestimonyImages(testimonyId: string): TestimonyImage[] {
  return imageMap[testimonyId] || [];
}

/**
 * Get profile image for a testimony author
 */
export function getAuthorProfileImage(
  testimonyId: string
): TestimonyImage | null {
  const images = getTestimonyImages(testimonyId);
  return images.find((img) => img.isProfile) || null;
}

/**
 * Get gallery images (non-profile) for a testimony
 */
export function getTestimonyGalleryImages(
  testimonyId: string
): TestimonyImage[] {
  const images = getTestimonyImages(testimonyId);
  return images.filter((img) => !img.isProfile);
}

/**
 * Generate optimized image URL for different sizes
 */
export function getOptimizedImageUrl(src: string): string {
  // For now, return the original URL
  // In production, you might use a service like Cloudinary or Next.js Image Optimization
  if (src.startsWith("http") || src.startsWith("/")) {
    return src;
  }
  return `/images/testimonies/${src}`;
}

/**
 * Check if an image exists (fallback to placeholder)
 */
export function getImageWithFallback(
  src: string,
  fallback: string = DEFAULT_AVATAR_URL
): string {
  // In a real app, you might want to check if the image exists
  // For now, we'll assume the mapping is correct
  return src || fallback;
}

/**
 * Generate avatar from name initials
 */
export function generateAvatarUrl(name: string, size: number = 100): string {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate a color based on the name
  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ];

  const colorIndex = name.length % colors.length;
  const backgroundColor = colors[colorIndex];

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'%3E%3Ccircle cx='${
    size / 2
  }' cy='${size / 2}' r='${size / 2}' fill='${encodeURIComponent(
    backgroundColor
  )}'/%3E%3Ctext x='50%25' y='50%25' font-family='serif' font-size='${
    size / 2.5
  }' font-weight='bold' text-anchor='middle' dy='0.35em' fill='white'%3E${initials}%3C/text%3E%3C/svg%3E`;
}

/**
 * Image upload utility (placeholder for future implementation)
 */
export interface ImageUploadOptions {
  testimonyId: string;
  file: File;
  isProfile?: boolean;
  caption?: string;
}

export async function uploadTestimonyImage(
  options: ImageUploadOptions
): Promise<TestimonyImage> {
  // Placeholder implementation
  // In a real app, this would handle file upload to your storage service

  const imageId = `${options.testimonyId}-${Date.now()}`;
  const fileName = `${imageId}.${options.file.name.split(".").pop()}`;

  return {
    id: imageId,
    testimonyId: options.testimonyId,
    src: `/images/testimonies/${fileName}`,
    alt: `Image for ${options.testimonyId}`,
    caption: options.caption,
    isProfile: options.isProfile || false,
    width: 600,
    height: 400,
  };
}

/**
 * Story page mappings from content.md
 */
const STORY_PAGE_MAPPINGS: Record<string, number[]> = {
  foreword: [4],
  "hum-do-humare-char": [8, 9, 10],
  "letter-from-son-to-son": [11, 12, 13],
  "dear-papa-soumya": [14],
  "meethi-reet": [15, 16, 17],
  "mere-papa-with-love": [18, 19, 20],
  "jaahi-vidhi-raakhe-ram": [21], // Based on image 21_Jaahi Vidhi Raakhe Ram
  devotion: [22], // Based on image 22_Devotion
  "best-of-all-of-us": [24, 25], // Elder brother JK Batra interview
  "tribute-to-tony-pkb": [26, 27], // PKB's tribute
  "mera-tony-neena": [28, 29], // Neena's interview
  "mujhe-sambhala": [30, 31], // Geeta's interview
  "uncle-by-blood-brother-by-bond": [32, 33], // Uncle Surendra Pal
  "bhatija-kahoon-ya-bhai": [34], // Bua Shashi
  "tony-taya-purusottam": [34], // Chacha Purushottam Lal
  "haazme-ki-goliyan": [35], // Bansi Aunty
  "tony-beta-krishna": [36], // Chachi Krishna
  "adventures-of-tony-pinky": [40, 41], // Pinky's story
  // Extended friend testimonies
  "adventures-of-petha-mufali": [71], // K.K. Aggarwal
  "bond-beyond-blood": [72, 73], // Arvind Mittal
  "bridge-of-hearts": [74, 75], // Shaikh Bashir Ahmed
  "friendship-endured-test-time": [76], // Ghanshyam Agarwal
  "batra-uncle": [77], // Megha Modi and Dipti Mittal
  "legacy-of-compassion": [78], // Raj Kumar Shahaney
  "two-friends-lifetime": [79], // M.R. Raman
  "ac-lagwa-dein": [80], // Dr Rishi Pal Singh
  "sarvagun-sampann": [81], // Shankar Swami
  "bhai-ki-yaadein": [82], // Vinod Gupta
  // Food and Recipe Section
  "tony-ism-love-for-food": [123], // Food philosophy
  "love-for-feeding": [124], // Feeding others
  "tonys-kitchen": [125], // Kitchen introduction
  "dry-fruit-namkeen": [126], // Recipe
  "laddu-sehat-wala": [127], // Recipe
  "besan-barfi": [128], // Recipe
  "baingan-bharta": [129], // Recipe by Geeta
  "lassi-kadhi": [130], // Recipe by Neena
  // Children's Section and Stories
  "tiny-section": [131], // Children's section intro
  "grandchildren-collage": [132], // Photo collage
  "elephant-king-poem": [133, 134], // Tony the Elephant King story
  "tony-nana-aaradhya": [135], // Granddaughter tribute
  "dear-tony-nanu": [136], // Granddaughter tribute
  "eshika-chopra-tribute": [137], // Granddaughter tribute
  "khushi-arora-tribute": [138], // Granddaughter tribute
  "suhaani-chopra-tribute": [139, 140], // Granddaughter tribute
  // Closing sections
  epilogue: [141], // Epilogue by Divya
  "comfort-messages": [142], // Condolence messages
  "taking-forward-tonyism": [143], // Final page
};

/**
 * Get images for a testimony that might span multiple pages
 */
export function getTestimonyImagesByPageRange(
  testimony: Testimony
): TestimonyImage[] {
  const galleryImages: TestimonyImage[] = [];

  // First check if testimony has explicit page range
  let pageRange: number[] = [];
  
  if (testimony.pageRange) {
    // Use explicit page range from testimony
    for (let page = testimony.pageRange.start; page <= testimony.pageRange.end; page++) {
      pageRange.push(page);
    }
  } else {
    // Try to get page range from content.md mappings
    pageRange = STORY_PAGE_MAPPINGS[testimony.id] || [];
  }

  if (pageRange.length === 0 && testimony.page) {
    // Fallback to single page from testimony data
    pageRange = [testimony.page];
  }

  if (pageRange) {
    // Get images from all pages in the range
    pageRange.forEach((page) => {
      const pageImages = getImagesForPageNumber(page);
      pageImages.forEach((imagePath, index) => {
        galleryImages.push({
          id: `${testimony.id}-page-${page}-${index}`,
          testimonyId: testimony.id,
          src: imagePath,
          alt: `${testimony.title} - Photo from page ${page}`,
          caption: `From page ${page} of the magazine`,
          width: 600,
          height: 400,
        });
      });
    });
  }

  return galleryImages;
}

/**
 * Bulk image processing for testimonies using page numbers
 */
export function getTestimonyImageSources(testimony: Testimony): {
  profileImage: string;
  galleryImages: TestimonyImage[];
} {
  // First check if testimony has images from CMS
  let galleryImages: TestimonyImage[] = [];
  
  // Check if testimony has images array (from CMS)
  if (testimony.images && testimony.images.length > 0) {
    galleryImages = testimony.images.map((imagePath, index) => {
      // Use custom caption if available, otherwise generate default
      let caption = testimony.imagesCaptions?.[imagePath];
      if (!caption) {
        // Parse filename to extract page number for default caption
        const filename = imagePath.split('/').pop() || '';
        const match = filename.match(/^(\d+)_/);
        const pageNum = match ? parseInt(match[1]) : testimony.page;
        caption = `From page ${pageNum} of the magazine`;
      }
      
      return {
        id: `${testimony.id}-cms-${index}`,
        testimonyId: testimony.id,
        src: imagePath,
        alt: `${testimony.title} - Image ${index + 1}`,
        caption,
        width: 600,
        height: 400,
      };
    });
  }
  
  // If no CMS images, try to get images by page number if available
  if (galleryImages.length === 0) {
    galleryImages = getTestimonyImagesByPageRange(testimony);
  }

  // If no page images found, fall back to the old mapping system
  if (galleryImages.length === 0) {
    galleryImages = getTestimonyGalleryImages(testimony.id);
  }

  // Try to get a profile image, fall back to generated avatar
  const profileImage = getAuthorProfileImage(testimony.id);

  return {
    profileImage: profileImage?.src || generateAvatarUrl(testimony.author),
    galleryImages,
  };
}

/**
 * Image preloading utility
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Lazy loading configuration for performance
 */
export const imageConfig = {
  // Common image sizes for responsive design
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 400 },
    large: { width: 1200, height: 800 },
  },

  // Quality settings
  quality: {
    thumbnail: 60,
    small: 75,
    medium: 80,
    large: 85,
  },

  // Lazy loading options
  lazyLoading: {
    rootMargin: "50px",
    threshold: 0.1,
  },
};
