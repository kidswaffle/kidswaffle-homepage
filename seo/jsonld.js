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
        sameAs: ['https://www.youtube.com/@키즈와플', 'https://pf.kakao.com/_Kxjwwxj']
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
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
      }
    ]
  };
}
