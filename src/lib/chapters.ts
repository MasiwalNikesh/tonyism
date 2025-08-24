export interface Chapter {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  content: string;
  images?: string[];
  quotes?: Quote[];
  timeline?: TimelineEvent[];
  stories?: Story[];
  magazinePages?: {
    startPage: number;
    endPage: number;
    stories: MagazineStory[];
  };
}

export interface MagazineStory {
  title: string;
  author: string;
  page: number;
  relationship: string;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  context?: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category: "personal" | "professional" | "family" | "legacy";
}

import { getImagesForStoryByPage, getImagesForMagazineStory } from './images';

export interface Story {
  id: string;
  title: string;
  author: string;
  relationship: string;
  content: string;
  page?: number;
  images?: string[];
}

export const chapters: Chapter[] = [
  {
    id: "foreword-family-foundation",
    title: "Foreword & Family Foundation",
    slug: "foreword-family-foundation",
    description: "The beginning of our journey through Tony's life - his foreword and immediate family's loving memories.",
    order: 1,
    content: `
      Welcome to this memorial magazine celebrating the extraordinary life of Tony Batra. This collection of memories, stories, and tributes represents the countless lives he touched with his warmth, wisdom, and unwavering love.

      The beautiful love story of Tony and Poonam, and their journey together as a family. A tale of partnership, understanding, and the creation of a loving home. The heartfelt words from Ashish, Soumya, Nikesh, and Divya - each sharing their unique bond with their father and father-in-law. These are the voices of love, gratitude, and cherished memories.
    `,
    stories: [
      {
        id: "foreword",
        title: "Foreword",
        author: "Editorial",
        relationship: "Introduction",
        content: `In loving memory of Gajender Batra, urf Tony, Bhai... Mamashree to me. Growing up, I was incredibly fortunate to have Tony Mama by my side. Sometimes he was a father figure, sometimes a friend, but most often he was my ever-cheerful, resourceful and loving "Mamashree". His presence was the highlight of my experiences at my Nani's house, and his ability to make everyone around him feel special left an indelible mark on my life. Through his actions and values, he imparted to me values that have subconsciously become a big part of who I am today.

This memory book is more than just a collection of remembrances; it's a celebration of his life and the joy he brought to all who knew him. This book is a collection of memories that reflect TONY-ism: the philosophy of living like TONY. It is a collection of memories that we have as a family. This book is a way to keep him and his legacy alive, particularly in the hearts of the people he touched, and also to share with the young ones who carry on ahead, and the little ones who have the right to experience his love. It is a collection- of laughter, love, tears and self-less devotion that made the man that he was.

Within these pages, you'll find a diverse array of elements: stories that capture the essence of his character, heartfelt messages of love, and poems from family and friends touched by his kindness and spirit. You'll also discover his passions - Bollywood, singing, cricket, puzzles woven throughout this interactive book, ensuring that his unique philosophy, which we lovingly call "TONY-ISM" lives on. Tony-ism reflects his approach to life, embodying principles of joy, generosity, and the ability to make every moment count.

This is just the beginning of a journey that started with a thought of how to keep him in our lives. Divya and I started with a vision, this is just the beginning of what we hope will be a continuing process of reliving Tony-ism, through which we aim to keep his legacy alive in our hearts and minds. Possibly future volumes, or days of celebrating Tony Mama, or different ways to cherish his kindness and zest for life. We will further explore his influence, offering new stories and insights from those who cherished him.`,
        page: 4,
        images: getImagesForStoryByPage(4)
      },
      {
        id: "hum-do-humare-char",
        title: "Hum Do Humare Char: Ek Pyaar Ka Nagma",
        author: "Poonam Batra",
        relationship: "Wife",
        content: `A trip down memory lane, with Poonam Batra, Tony's wife

Over time, our friendship grew into something more. एक प्यार का नगमा है, मौजों की खानी है, zindagi और कुछ भी नहीं, तेरी मेरी कहानी है। but like many love stories, my parents didn't approve. The memories go back to the years we started meeting (I won't say dating). Those days, it was not considered good to date, and my parents disliked it, but we both couldn't stop meeting. For me, his friendly nature and open-heartedness were a magnet because I was not very attached to my family. He and his family seemed so close-knit, the difference between the two families was huge. His was a simple, religious family, and his humorous anecdotes about them and their warmth attracted me instantly. What he saw in me, I don't know. But we were always happy to see each other.

He used to come to Saket for work on his two-wheeler, and I was posted at the Nehru Place branch of BOB not very far. I knew he found excuses to come and see me, have a cup of tea in the bank or outside, and he would drop me home in Geetanjali on his scooter. We never thought of hiding from our parents, as we didn't think there was anything "special" between us - just two friends having a good time.

We had to wait patiently for seven years. Ultimately, they gave in, but on their own terms, and never accepted our marriage till their end. But I was lucky. Tony's parents and relatives accepted me with open arms and never made me feel guilty.

We were blessed with two lovely children. Ashish and Divya, and I'm glad they have both imbibed their father's values of love and respect. He was a husband and father par excellence - a man of passion, always ready to fulfil your desires. Be it food, clothes, or gifts, you only had to mention it, and he'd get busy getting it. He religiously followed the principle that whenever you return home in the evening from work, never come empty-handed, bring something for your children or family.

We both loved to host parties and celebrate birthdays, not just of Ashish and Divya, but also Shweta and Abhishek. Our anniversary, parents' anniversary, and Bhaiya's anniversary too. The invitees included not only their school friends but also neighbors, friends, and extended family. The whole family would gather at our home for Rakhi and Tikka, and these occasions were celebrated with great enthusiasm, with ample gifts and food to suit everyone's tastes.

Each occasion was a testimony to his good nature. His generous supplies sometimes made us say, "Bas, aur nahi, nahi chahiye!" His friends and family loved this habit of gifting. But he went to such extremes that they seemed terrified! Whenever he visited, they were sure he'd bring so much to eat and gift so many things that they'd keep telling me to ask him not to bring so much.

He was always eager to fulfill your desires. He loved street food, loved to eat, but after being told to reduce weight, he had to avoid fried items. That made him a bit fussy. He'd bring snacks, want to eat them, but wouldn't, and that made everyone unhappy. "If you can't eat, why bring so much?" was a common reaction.

He bought clothes for himself regularly. but wouldn't wear them - always telling Bhaiya, "ए लो पापे, ए त्वानु आ जाएगा" He was super happy and excited when his clothes fit Nikesh, telling Divya that you have chosen the perfect boy and Nikesh was equally happy to wear his clothes and shoes.

He was an expert adviser on gifts - what to buy and from where. He knew every food joint - kahan ka khaana achha hai and had brilliant ideas for every function or wedding in the family or friends circle. And he wouldn't just give advice - he was willing and able to take responsibility and get it done himself. He had so many contacts and the confidence to ask - "भाई, मुझे ये काम था, हो पायेगा?" And nobody ever refused.

His friends were just like him - loving, friendly. generous. The best part? He was loved not only by his own peer group but also by their wives and children. All the bhabhis adored him, never tired of telling me how lucky I was to have such a good, loving husband. Their children respected him immensely, called him Tauji, and asked for advice freely. Even friends grandchildren - they all loved him, and he loved them. His absence is now felt in every function or gathering because I think they all sensed the inner vibes of pure love and affection that flowed through him.

Even the children near our house miss him terribly. He would carry small children in his arms and bring them home to give them chocolates. He would always ask Ashish to bring boxes of chocolates from his company to keep at home for just this purpose.

But all said and done. Tony and I lived a great life - full of ups and downs. I got angry more often than him, sometimes at his overly simplistic behavior and trusting nature. But he was the torchbearer and source of joy and happiness for everyone in the family - bringing a smile to every face, whether in the street, his friend circle, or any family gathering. No get-together was ever complete without him.

When I look at Divya, Ashish, and other children in the family, I see a reflection of Tony. They all have that "Tony-ism" in them - the way they made a group called Vaanar Sena, stood beside him till his last breath, prayed for him, went to healers, consulted doctors, sourced rare medicines, and continue to offer 24x7 moral and physical support to me. A big salute to Tony-ism.

During our journey, we went through good times and bad, but we always received the love and support of Tony's family. I am thankful for their unconditional support. Thanks for being part of our journey and for the many pleasant experiences.

And what more can I say, except for the feeling left behind...
अकेले हैं, चले आओ जहाँ हो कहाँ आवाज़ दें तुमको, कहाँ हो अकेले हैं, चले आओ... ये तन्हाई का आलम और उस पर आपका गम न जीते हैं, न मरते बताओ, क्या करें हम अकेले हैं, चले आओ...`,
        page: 8,
        images: getImagesForMagazineStory("Hum Do Humare Char", 8)
      },
      {
        id: "letter-from-son-to-son",
        title: "A Letter from a Son, to his Son",
        author: "Ashish",
        relationship: "Son",
        content: `To my dearest Samarth, There's someone very special I want to tell you about with this letter, someone who would have loved you with all his heart. Someone you met very shortly, but whose love you carry in your presence, your smile, and your spirit. This letter is about your Dadu - my father a man I miss every single day. 

Your Dadu was the son every son wants to be. The way he took care of his parents was something I will always admire. He did everything under the sun to fulfill their needs, not just the big things, but also the smallest ones that only a truly loving son would notice. And it wasn't just his parents, he extended that same respect and service to every elder in the family. His uncles, aunts, even his elder siblings, he looked after them all with deep affection and a sense of duty that came naturally to him. 

Your Dadu was the brother every brother wants to be. He shared a bond with his siblings that was rooted in joy, laughter, and unshakeable loyalty. Their conversations were filled with laughter, food, and memories. He kept in touch with cousins too, near and distant, through impromptu calls, surprise visits, and never missing a birthday. There was always a warmth in his relationships that made people feel special just by being around him. 

Your Dadu was the friend every friend wants to be. To him, friends were truly family. He made time for them, celebrated with them, stood by them in tough times, and never let distance or time weaken those bonds right from Kashmir to Tamil Nadu. The list of his friends was never-ending, and yet, he made each one feel like they were his best friend. People came to him not just for a laugh, but for comfort, and always for a warm hug. 

Your Dadu was the mamu and chachu every uncle wants to be. He was the go-to adult for all the kids in the extended family - someone they could talk to, laugh with, confide in. He showered his nephews and nieces with affection, endless hugs, and their favourite food. He never came empty-handed. His love was loud, open, and deeply felt. 

Your Dadu was the husband every husband should aspire to be. He was a constant companion to your Dadi. Through all the highs and lows of life, he stood besides her with humour, strength, and unwavering support. He celebrated her wins & shared her worries Their love wasn't just in words, it was in the everyday things. 

Your Dadu was the kind of father I hope I can be. He gave me the support to shape and chase my dreams, your foofy and I were spoilt for choices but yet he and maa always kept us grounded (I think). They always kept our needs first, and always gave us what we really wanted. Whenever I didn't know what to do, I would call him and he would do everything possible in the world to help me.

He found his peace in his daily pooja paath, Sunderkaand, Hanuman chalisa and his "Jai Shri Ram", and somehow shared that peace with everyone around him. His spirituality was a key aspect of his entire life.

And now, my dear Samarth, here's what I want you to know most of all: There is no doubt in my mind (or anybody who knew him well) - Your Dadu would have been the most amazing Dadu in the world.

You would have been his little prince, his Golumal. He would've spoiled you endlessly! With food, hugs, stories, and laughter. He would've held you in his arms every morning, sung you bhajans, shown you the world on his shoulders, and told you all the stories of his pranks with his siblings and outings with your Dadi. He would've sat with you on the floor while you played, and been the first to cheer for you in everything you did.

I sometimes imagine the two of you together! and though it makes me smile, it also brings a tear. Because I know how lucky I was to have him, and how lucky you would have been too.

But here's what I promise you: I will try, every single day, to be the kind of father to you that he was to me. Loving, present, full of laughter, full of hugs. I may not get everything right, but I will never stop trying. Through me, I hope you will feel a little bit of his love too.

And someday, when you're older, if someone ever asks you what your father was like... I hope you smile and think of love, laughter, warmth, and lots of food & gifts. Just like I do when I think of your Dadu.

With all my love. Papa (Ashish Batra, Tony's Son)`,
        page: 11,
        images: getImagesForStoryByPage(11)
      },
      {
        id: "dear-papa-soumya",
        title: "Dear Papa",
        author: "Soumya",
        relationship: "Beti, Daughter-in-law",
        content: `Seven years of knowing you, your love for a lifetime.. it will be impossible to recount what we shared through instances over these years, there were times you understood without me saying what I needed, there were times you asked "tu bol na beti.. ho jayega... there were times you took me by surprise with just how thoughtful one could be.

Words will fall short and no one needs any telling of what we had which was special in its own very strong way. You were always there, you will always be there. Samarth knows you, your love, your spirit, through your everlasting blessings.

How I wish you were here, how I still imagine so many times and re-live a few precious moments of my day with you around.

It is true the void is impossible to fill, but I will remind myself there was so much life you added to the years, I won't count the years to life.

Love and light to you always, Papa! Soumya (Beti, Daughter-in-law)`,
        page: 14,
        images: getImagesForStoryByPage(14)
      },
      {
        id: "meethi-reet",
        title: "A Meethi Reet",
        author: "Nikesh Masiwal",
        relationship: "Beta, Son-in-Law",
        content: `My first interaction with Papa was in 2018, one afternoon in my office. A new brief had come in from a client. Unsure if it was practical, I discussed it with Divya, who told me to call the best man for the job. Thinking he was speaking to Divya's boss, he took my call. I sent him images on WhatsApp. and Papa asked. "Yeh tum kaise karna chahte ho?" I said, "Mujhe nahi pata," and he guided me on practical additions to the Welcome Kit for Godrej Hicare. Little did I know it was also a Welcome Kit for me.. into Tony-ism and all the love to come.

Papa first came into my life in 2014-2015, when I travelled with Divya in the Metro. He'd call her exactly at JLN Stadium, Chandni Chowk, and Kashmere Gate to ask her location. As she went downstairs to him at Jahangirpuri, I tried catching fleeting glimpses, imagining a Bollywood-style Punjabi Papa with a jeep and moustache. The distance from where I stood was just a staircase away, but my assumptions were far off. Had I dared to follow Divya and say hi, I now know he would have taken me to the best chaat corner in Shalimar Bagh. Later, while working in printing, he told me, "Ek baar try kar lo aur print kar lo, kuch galat hua toh ek aur mauka milta hai- life ki sahi print mein."

In the years ahead, we worked on projects from Asian Paints to Synergy, and every client remembered him. Even one call left people thinking, "Kaam aur baat aise karo ke mulaqat ke baad bhi koi bhule na." When the day came that we actually spoke after Divya revealed of our relationship, he told me, 'Beta, mujhe pata tha tum hi ho jab meine pehli baat ki thi. Just like a forma in printing, it set the base to a chapter in my life that would have its imprint forever.

Meeting Papa and Mummy, finally, on 14th Feb 2021 was just as important. Nervous but excited, we met at NSP in Starbucks, later ending up at Pind Baluchi. While I sweated over papa's favorite hari mirch ke parathe, the meeting was filled with their questions, stories, and that ever-present love. Papa called it our anniversary each year, celebrating the start of a new bond. Divya was back in Mumbai, overthinking scenarios about the meeting, and we were sharing snaps Mummy and Papa asked me about work, hobbies, and family.. and of course, 'Aur kya khaoge? That meeting, with a bit of mirch in it, ended with a sweet selfie with Mummy and Papa that remains my favourite, and I'm glad we could recreate it after 2 years. Papa celebrated 14 Feb as "Happy Anniversary of us meeting for the coming years.

The next day, as I returned to Mumbai, Papa insisted on dropping me to the airport. I was looking at maps and we were clearly not on the path to go to the airport, which was confirmed when Papa stopped the car at a famous mithai shop, whose owner smiled and shook hands when he saw Papa. He ordered mithai and biscuits (for Divya), and as time went by the list became longer, my bag heavier, and time shorter for my check-in to close. Then I saw 'Mota Seth (Divya)' flashing on the screen, asking Papa to hurry.

On the way to the turning of IGI. a police guy stopped us for me not wearing a mask and asked for Rs 2000. I tried to make up stories, but Papa paid him off- which I was very unhappy about. Later, with overloaded luggage and lots of love, I flew to Mumbai after the first of many airport drop-offs by Papa. At that time, I did not know Papa's faith for Hanumanji, but as I look back, he practised acts of who he prayed to. Just like Hanumanji came to Ashok Vatika for Sita ji and acted not as a messenger, but as a comforter, warrior, and devotee, Papa followed that learning unknowingly with everyone. He would comfort and stand beside all the people he met. leaving a lasting imprint.

Our bond grew slowly but steadily. I did not like gifts, and he did not like me not taking them. So over the years, whenever he asked, "Beta kya laaun?", I would ask for any one thing. I knew he would add two or three more... but that's okay. I accepted his way of love. Today, there is nothing in my wardrobe that was bought by me as my first choice, all his. My hands go and pick something or anything that he picked for me.

He was the happiest when we shopped, went out eating, although he would do neither. He just liked giving it all. He never got upset or angry, except three times. First, when I wore the ring on the wrong finger during our ring ceremony. Second, when I kept my rudraksha on the side table, he said, Yeh pavitra cheez hai, aise nahi karte Third, during Shani puja at the mandir on Saturday. I can't count the number of times he had made us all smile. Someone who did not tell others his heart aches but would take part in giving joys to others. Like the one he prayed to, adored, and reminded others saying "Jai Shree Ram," he followed him to his last day- in choosing exile over ease, silence over rage, and virtue over vengeance.

We miss his morning messages, and Tuesday Sundarkaand where he used to sing प्रभु चरित्र सुनिबे को रसिया राम लखन सीता मन बसिया ॥"

It was in those moments that he was in his truest happy place, just as he was when handing out chocolates to children or when giving us gifts as though each one carried a piece of his heart, or during his reverent morning prayers to his Bajrang Bali..

I have only been blessed to know him for four short years, but in that time, he gave us a lifetime's worth of love, protection, and wisdom. There were days between 2023-2024 when he would come to pick me up at Jahangirpuri, in the same way he had done for Divya a decade earlier. Sometimes, I wish I had dared to meet him sooner. Perhaps I would have received more of his love, blessings, more time.

When his health started failing, we all prayed. We all hoped, chanting the Hanuman Chalisa and Mahamrityunjaya Mantra.

His farewell was silent. Like Hanuman departing from Sita, not with grand speeches, but with folded hands, moist eyes, and Ram's name in his heart, he left without saying "goodbye." Like in Sunderkaand "In serving and remembering Ram, there is no final parting, only a pause before the next meeting."

Now we just pray that whenever that next meeting is, this life or the next, it will be like those Tuesdays again, with his voice carrying the verses he loved so much.`,
        page: 15,
        images: getImagesForStoryByPage(15)
      }
    ],
    quotes: [
      {
        id: "family-quote-1",
        text: "Babu Moshai... zindagi badi honi chahiye, lambi nahin!",
        author: "Tony Batra",
        context: "His life philosophy",
      },
    ],
    magazinePages: {
      startPage: 4,
      endPage: 22,
      stories: [
        { title: "Foreword", author: "Editorial", page: 4, relationship: "Introduction" },
        { title: "Hum Do Humare Char: Ek Pyaar Ka Nagma", author: "Family", page: 8, relationship: "Family Story" },
        { title: "A Trip Down Memory Lane", author: "Poonam Batra", page: 8, relationship: "Wife" },
        { title: "A Letter from a Son, to his Son", author: "Ashish", page: 11, relationship: "Son" },
        { title: "Dear Papa", author: "Soumya", page: 14, relationship: "Daughter-in-law" },
        { title: "A Meethi Reet", author: "Nikesh Masiwal", page: 15, relationship: "Son-in-law" },
      ],
    },
  },
  {
    id: "elders-perspectives",
    title: "Elders' Perspectives: Those He Respected Most",
    slug: "elders-perspectives",
    description: "Wisdom and memories from Tony's elder brothers, sisters, uncles, aunts, and family elders who shaped his life.",
    order: 2,
    content: `
      ## From Those He Respected The Most
      The voices of wisdom from Tony's elder generation - those who watched him grow, guided his path, and shared in his journey through life.

      ## His Elder Brothers
      Stories from Jitendra Kumar Batra and Pushpinder Kumar Batra (PKB), who knew Tony from his earliest days and watched him become the man everyone came to love and respect.

      ## His Beloved Sisters
      Heartfelt memories from Neena Chawla and Geeta Sachdeva, who shared childhood adventures and lifelong bonds with their dear brother.

      ## Extended Family Elders
      The loving words from uncles, aunts, and family elders who embraced Tony as their own son and brother, each carrying unique memories and perspectives.
    `,
    quotes: [
      {
        id: "elder-quote-1",
        text: "Mujhe Sambhala... Aur Khud Bhag Gaya",
        author: "Mrs Geeta Sachdeva",
        context: "Sister's loving lament",
      },
    ],
    magazinePages: {
      startPage: 23,
      endPage: 39,
      stories: [
        { title: "Elders' Perspective Introduction", author: "Editorial", page: 23, relationship: "Introduction" },
        { title: "The Best of All of Us - Interview", author: "Jitendra Kumar Batra", page: 24, relationship: "Elder Brother" },
        { title: "A Tribute to Tony", author: "Pushpinder Kumar Batra (PKB)", page: 26, relationship: "Elder Brother" },
        { title: "Mera Tony - Interview", author: "Neena Chawla", page: 28, relationship: "Elder Sister" },
        { title: "Mujhe Sambhala... Aur Khud Bhag Gaya", author: "Mrs Geeta Sachdeva", page: 30, relationship: "Elder Sister" },
        { title: "Uncle by Blood, Brother by Bond", author: "Mr Surendra Pal Batra", page: 32, relationship: "Uncle" },
        { title: "Bhatija Kahoon Ya Bhai", author: "Mrs Shashi Mutreja", page: 34, relationship: "Bua" },
        { title: "TONY TAYA", author: "Mr Purushottam Lal Batra", page: 34, relationship: "Chacha" },
        { title: "Haazme Ki Goliyan", author: "Mrs Harbans Diwan (Bansi Aunty)", page: 35, relationship: "MamiJi" },
        { title: "TONY BETA", author: "Mrs Krishna Batra", page: 36, relationship: "Dear Chachi" },
      ],
    },
  },
  {
    id: "family-circle",
    title: "A Man of Many Cousins: Brothers, Sisters & Friends-in-law",
    slug: "family-circle",
    description: "The extended family circle - cousins, in-laws, and family friends who were like siblings to Tony.",
    order: 3,
    content: `
      ## A Man of Many Cousins
      Tony's gift was making every cousin feel like a sibling, every in-law feel like family, and every family friend feel truly at home.

      ## Adventures and Bonds
      From childhood adventures with Pinky (Mohinder Kumar Batra) to the warmth shared with sisters-in-law and brothers-in-law, these relationships defined the richness of Tony's life.

      ## The In-Law Family
      Beautiful tributes from those who became family through marriage but felt the genuine love and acceptance that Tony offered to everyone who entered his circle.

      ## Extended Family Love
      Stories of double dates, surprises, family gatherings, and the countless ways Tony made everyone feel special and valued.
    `,
    quotes: [
      {
        id: "family-circle-quote-1",
        text: "Bhari Mahfil Mein Toot Gaya Ek Sitara",
        author: "Sushma Khanna",
        context: "Cousin Sister's tribute",
      },
    ],
    magazinePages: {
      startPage: 40,
      endPage: 69,
      stories: [
        { title: "A Man of Many Cousins Introduction", author: "Editorial", page: 40, relationship: "Introduction" },
        { title: "Adventures of Tony and Pinky", author: "Mohinder Kumar Batra", page: 40, relationship: "Cousin, BFF" },
        { title: "A Double Date in 1988", author: "Poonam Mohinder Batra", page: 42, relationship: "Bhabhi" },
        { title: "Man of Surprises", author: "Poonam Mohinder Batra", page: 43, relationship: "Bhabhi" },
        { title: "Blessings to Tony", author: "Ranjit Chawla", page: 44, relationship: "Brother-in-Law" },
        { title: "Nekdil, Khushmizaj", author: "Bimla Pruthi", page: 45, relationship: "Cousin Sister" },
        { title: "Humare Bhai, Ya Yun Kahein Hamare Sabse Zyada Khayal Rakhne Wale Bhai", author: "Madhu and Rajan K. Dewan", page: 46, relationship: "Cousin brother and Bhabhi" },
        { title: "The Best Jadoo Ki Jhuppy", author: "Bhushan Khanna", page: 47, relationship: "Brother-in-law, Friend" },
        { title: "Bhari Mahfil Mein Toot Gaya Ek Sitara", author: "Sushma Khanna", page: 48, relationship: "Cousin Sister" },
        { title: "Bathroom Mein Chhup Ja!!", author: "Ranjan Diwan", page: 50, relationship: "Cousin Brother" },
        { title: "A Legacy of Love and Loyalty", author: "Ravi Khattar", page: 52, relationship: "Brother" },
        { title: "Jitna Kaha Jaye, Kam Hai", author: "Savita Khattar", page: 53, relationship: "Bhabhi" },
        { title: "His Presence Had a Way of Bringing Light Into the Space", author: "Rashmi Verma", page: 54, relationship: "Cousin Sister" },
        { title: "My Go-to Person", author: "Sanjeev Mutreja (Bobby)", page: 55, relationship: "Cousin Brother" },
        { title: "Batra Ji, A Very Loving Family Person", author: "Savita and Praveen Bhatia", page: 57, relationship: "Samdhi, Friends" },
        { title: "A Beacon of Hope and Positivity", author: "Pramila and Sarat Bhatia", page: 58, relationship: "Uncle and Aunty of Soumya" },
        { title: "A Rare Soul", author: "Sanjay Vasist", page: 59, relationship: "Admirer, Uncle of Soumya" },
        { title: "Agar Sau Mein Se Das Aadmi Punyatma Honge, Toh Unmein Se Ek Batra Ji Zaroor Honge", author: "Kamla Masiwal", page: 60, relationship: "Samdhan" },
        { title: "Shukriya Hamari Zindagi Mein Aane Ke Liye", author: "Mohan Masiwal", page: 61, relationship: "Mitra, Samdhi, Singing Partner" },
        { title: "Dear Tony Bhaiya", author: "Anju", page: 62, relationship: "Cousin Sister" },
        { title: "My Dear Brother Tony", author: "Pratibha Ahuja (Kuki)", page: 63, relationship: "Cousin Sister" },
        { title: "Jai Shri Ram Bhaiya", author: "Poonam (Mumbai)", page: 64, relationship: "Sister" },
        { title: "Mere Pyare Tony Bhai!", author: "आपका भिंडी, आपका भाई पिंकी", page: 65, relationship: "Brother" },
        { title: "In Remembrance", author: "Gautam, Ritu, Brian and Remy", page: 66, relationship: "Brother-in-law and family" },
      ],
    },
  },
  {
    id: "friends-professional-life",
    title: "Tere Jaisa Yaar Kahan: Tributes from Friends & Colleagues",
    slug: "friends-professional-life",
    description: "The bonds of friendship and professional relationships that enriched Tony's life beyond family.",
    order: 4,
    content: `
      ## Tere Jaisa Yaar Kahan
      The friends who became family, the colleagues who became confidants, and the professional relationships that were built on trust, respect, and genuine affection.

      ## School and College Friendships
      From the Air Force School connections to lifelong friendships that began in childhood and continued through decades of shared experiences.

      ## Professional Relationships
      Colleagues, clients, and business associates who found in Tony not just a professional partner but a friend who could be trusted, relied upon, and cherished.

      ## Community Connections
      Neighbors, community members, and acquaintances who were touched by Tony's warmth and genuine interest in their lives and wellbeing.
    `,
    quotes: [
      {
        id: "friends-quote-1",
        text: "If You Have Two Friends in Your Lifetime, You're Lucky",
        author: "M. R. Raman",
        context: "Friend's tribute",
      },
    ],
    magazinePages: {
      startPage: 70,
      endPage: 96,
      stories: [
        { title: "Tere Jaisa Yaar Kahan Introduction", author: "Editorial", page: 70, relationship: "Introduction" },
        { title: "The Adventures of Petha and Mufali", author: "K. K. Aggarwal (Bittoo)", page: 71, relationship: "Friend" },
        { title: "A Bond Beyond Blood - A Tribute to G K Batra (Tony Bhaiya)", author: "Arvind Mittal", page: 72, relationship: "Friend since 1980" },
        { title: "A Bridge of Hearts - A Tribute to Shri Gajender Kumar Batra (Tony ji)", author: "Shaikh Bashir Ahmed", page: 74, relationship: "Friend" },
        { title: "Friendship That Endured The Test of Time", author: "Ghanshyam Agarwal (Sirjee)", page: 76, relationship: "Friend" },
        { title: "BATRA UNCLE!!!!!!", author: "Megha Modi and Dipti Mittal", page: 77, relationship: "Friend's Daughters" },
        { title: "A Legacy of Compassion and Love", author: "Mr Raj Kumar Shahaney (RKS)", page: 78, relationship: "Friend" },
        { title: "If You Have Two Friends in Your Lifetime, You're Lucky", author: "M. R. Raman", page: 79, relationship: "Friend" },
        { title: "Aapke Yahan Par AC Lagwa Dein?", author: "Dr Rishi Pal Singh", page: 80, relationship: "Friend, Neighbour, Chai Partner" },
        { title: "Sarvagun Sampann Mahamanav", author: "Shree Shankar Swami", page: 81, relationship: "Guru, Mitra" },
        { title: "Bhai Ki Yaadein", author: "Vinod Gupta", page: 82, relationship: "Kareebi Dost aur Salahkar" },
        { title: "Jaane Dost", author: "Arun", page: 83, relationship: "Friend" },
        { title: "Yaadein", author: "Alka Singh", page: 87, relationship: "Principal, Air Force Golden Jubilee Institute" },
        { title: "Ho Jayega Yaar!", author: "Brijesh", page: 88, relationship: "The Air Force School" },
        { title: "TONY: WALKING SUNSHINE", author: "Deepika Thapar Singh", page: 89, relationship: "Principal, The Air Force School (2007-2016)" },
        { title: "Tribute to Tony Ji", author: "Manju Malhotra", page: 90, relationship: "The Air Force School" },
        { title: "In Loving Memory of Gajender Batra Ji", author: "Atul Kumar", page: 91, relationship: "Friend" },
        { title: "A Saint in Disguise", author: "Gopal Dewan", page: 91, relationship: "Friend" },
        { title: "Super Bhakt Tony Bhaiya", author: "Ghanshyam Maurya", page: 92, relationship: "More than Support Staff" },
        { title: "Gone from Sight, Forever in Souls", author: "DN Chopra", page: 93, relationship: "Poonam's Colleague" },
        { title: "Shraddha Suman", author: "Smt Raj Seth", page: 94, relationship: "Poetess, Poonam's Colleague" },
        { title: "Gali Ki Raunak", author: "Smt. Saroj Julka", page: 94, relationship: "Neighbor" },
      ],
    },
  },
  {
    id: "next-generation",
    title: "Vaanar Sena: Love from Nieces, Nephews & the Next Generation",
    slug: "next-generation",
    description: "The young voices who called him Uncle, Chacha, Mama - carrying forward his legacy with love and admiration.",
    order: 5,
    content: `
      ## Vaanar Sena
      The younger generation who brought joy to Tony's life and who carry his memory forward with love, laughter, and the values he instilled in them.

      ## From Nieces and Nephews
      The special bonds between Tony and the children of his siblings and cousins - relationships filled with fun, guidance, and unconditional love.

      ## Sons-in-law Perspectives
      The unique viewpoint of those who joined the family and found in Tony not just a father-in-law but a mentor, friend, and source of wisdom.

      ## The Next Generation's Legacy
      How Tony's influence continues through the younger generation, shaping their values, their approach to life, and their understanding of what it means to be part of a loving family.
    `,
    quotes: [
      {
        id: "next-gen-quote-1",
        text: "My First Ever Black Label Bottle Came From..Guess Who?",
        author: "Akshay Batra",
        context: "Nephew's fond memory",
      },
    ],
    magazinePages: {
      startPage: 97,
      endPage: 114,
      stories: [
        { title: "Vaanar Sena Introduction", author: "Editorial", page: 97, relationship: "Introduction" },
        { title: "Aur Beta, Sab Theek?", author: "Abhishek Batra", page: 98, relationship: "Nephew" },
        { title: "My First Ever Black Label Bottle Came From..Guess Who?", author: "Akshay Batra", page: 99, relationship: "Nephew" },
        { title: "The Unforgettable Embrace: Honoring Tony Mama", author: "Amit Kaistha", page: 100, relationship: "Son-in-Law" },
        { title: "\"A wholesome Person\"", author: "Anshuman Chawla", page: 102, relationship: "Nephew" },
        { title: "A Father Figure", author: "Anshuman Chawla", page: 103, relationship: "Nephew" },
        { title: "A heart of gold", author: "Anuj Saigal", page: 104, relationship: "Son-in-Law" },
        { title: "चाचू – हर रिश्ते में प्यार, हर मोड़ पर साथ", author: "Ekta Batra Chopra", page: 105, relationship: "Niece" },
        { title: "टोनी मामा - मेरा रिश्ता, मेरी यादें", author: "Dr Manisha Sachdeva", page: 106, relationship: "Niece" },
        { title: "टोनी मामा, मेरा रिश्ता, मेरी यादें (continued)", author: "Dr Manisha Sachdeva", page: 107, relationship: "Niece" },
        { title: "To live selflessly and love unconditionally", author: "Mukul Arora", page: 108, relationship: "Son-in-Law" },
        { title: "My very fond memories of tony mamaji", author: "Navita Sachdeva", page: 109, relationship: "Daughter-in-Law" },
        { title: "\"It's honestly hard to explain him in words....\"", author: "Rajan Sethi", page: 110, relationship: "Son-in-Law" },
        { title: "Mukaish ki Saree", author: "Roopshree C Kaistha", page: 111, relationship: "Niece" },
        { title: "My Ode to the Man who loved", author: "Ruchika Chawla", page: 112, relationship: "Niece" },
        { title: "\"Aaj hum katha sunate hain... Ram nahi, Ram bhakt ki...\"", author: "Saryu Khanna", page: 113, relationship: "Niece" },
        { title: "See You Again!", author: "Shreya Bhatia", page: 114, relationship: "Soumya's sister" },
      ],
    },
  },
];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.slug === slug);
}

export function getNextChapter(currentSlug: string): Chapter | undefined {
  const currentChapter = getChapterBySlug(currentSlug);
  if (!currentChapter) return undefined;

  return chapters.find((chapter) => chapter.order === currentChapter.order + 1);
}

export function getPreviousChapter(currentSlug: string): Chapter | undefined {
  const currentChapter = getChapterBySlug(currentSlug);
  if (!currentChapter) return undefined;

  return chapters.find((chapter) => chapter.order === currentChapter.order - 1);
}
