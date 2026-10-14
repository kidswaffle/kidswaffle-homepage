// Structured data (schema.org JSON-LD) injected into index.html at build time by vite.config.js.
const SITE = 'https://www.kidswaffle.com/';

export function buildJsonLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': SITE + '#org',
        name: '키즈와플',
        alternateName: ['KIDSWAFFLE', '키즈와플 오감팡팡', '오감팡팡'],
        url: SITE,
        logo: SITE + 'logo.png',
        description: '문화센터에서 진행하는 부모와 생후 5~24개월 영유아가 함께 듣는 오감놀이 수업 브랜드. 한 클래스 최대 10명.',
        email: 'kidswaffle@naver.com',
        founder: { '@type': 'Person', name: '이승진' },
        areaServed: ['수원시', '화성시', '서울특별시', '파주시'],
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'kidswaffle@naver.com', url: 'https://pf.kakao.com/_Kxjwwxj', availableLanguage: 'ko' },
        sameAs: ['https://www.youtube.com/@키즈와플', 'https://pf.kakao.com/_Kxjwwxj', 'https://www.instagram.com/kidswaffle_official']
      },
      {
        '@type': 'WebSite',
        '@id': SITE + '#website',
        name: '키즈와플 오감팡팡',
        url: SITE,
        inLanguage: 'ko',
        publisher: { '@id': SITE + '#org' }
      },
      {
        '@type': 'Course',
        '@id': SITE + '#course',
        name: '키즈와플 오감팡팡',
        description: '문화센터에서 엄마와 생후 5~24개월 영유아가 함께 듣는 오감놀이 수업. 매주 하나의 주제로 인사·노래, 인지카드, 오감교구, 포토존·정리가 이어지며 한 클래스 최대 10명으로 진행합니다.',
        url: SITE,
        inLanguage: 'ko',
        provider: { '@id': SITE + '#org' },
        audience: { '@type': 'PeopleAudience', audienceType: '생후 5~24개월 영유아와 부모' },
        typicalAgeRange: '5-24개월',
        syllabusSections: [
          { '@type': 'Syllabus', name: '인사·노래', description: '엄마와 함께 인사하고, 악기로 소리와 리듬을 느끼며, 끝 인사노래로 마무리합니다.' },
          { '@type': 'Syllabus', name: '인지카드', description: '선생님이 단어를 읽으면 엄마가 따라 읽고, 아이는 보고 들으며 시각과 청각을 자극합니다.' },
          { '@type': 'Syllabus', name: '오감교구', description: '1:1 오감활동으로 아이의 성향을 확인하고, 아이에 맞게 활동을 진행합니다. 교구는 매 수업 소독합니다.' },
          { '@type': 'Syllabus', name: '포토존·정리', description: '매주 새로운 테마 포토존에서 영유아 아이만 촬영하고, 놀이 후에는 엄마와 함께 정리합니다.' }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      }
    ]
  };
}
