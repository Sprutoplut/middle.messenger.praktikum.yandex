import ImgPeople from '/img/PhotoPeople.png';
import Read from '/img/Read.png';

type messages = {
    message?: string;
    time?: string;
    author?: string;
    read?: string;
}

type messagesBlock = {
    messages?: messages[],
    dateBlock?: string,
}

type MemberListProps = {
    MemberPhoto?: string;
    LastMessageDate?: string;
    LastMessageWho?: string;
    LastMessage?: string;
    CountNoReadMessage?: number;
    MemberName?: string;
    messagesBlock: messagesBlock[],
    onClick?: () => void;
}

export default [
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: 'Вы',
    MemberName: 'Андрей',
    LastMessageDate: '10:49',
    LastMessage: 'Фото до сих пор поражает — на фоне чёрного космоса видна голубая Земля с облаками.',
    CountNoReadMessage: 2,
    messagesBlock: [
      {
        dateBlock: '20 июня',
        messages: [
          {
            message: 'Только что узнал: в 1972 году астронавты Аполлона-17 сделали последнюю фотографию Земли с поверхности Луны.',
            time: '08:15',
            author: 'author',
            read: '',
          },
          {
            message: 'Фото до сих пор поражает — на фоне чёрного космоса видна голубая Земля с облаками.',
            time: '08:30',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '19 июня',
        messages: [
          {
            message: 'А вы знали, что камеры Хассельблад использовали не только в космосе, но и на Земле для сверхточных измерений?',
            time: '11:20',
            author: 'author',
            read: '',
          },
          {
            message: 'Их применяли в геодезии и картографии благодаря невероятной чёткости.',
            time: '11:40',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: '',
    MemberName: 'Ольга',
    LastMessageDate: '12:30',
    LastMessage: 'На снимке видно, как он проверяет крепление — это за секунды до исторического шага.',
    CountNoReadMessage: 0,
    messagesBlock: [
      {
        dateBlock: '18 июня',
        messages: [
          {
            message: 'В архивах НАСА обнаружили фото, где Армстронг держит камеру Хассельблад перед выходом на Луну.',
            time: '14:10',
            author: 'author',
            read: '',
          },
          {
            message: 'На снимке видно, как он проверяет крепление — это за секунды до исторического шага.',
            time: '14:25',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '17 июня',
        messages: [
          {
            message: 'Оказывается, камеры Хассельблад модифицировали вручную — без заводских чертежей!',
            time: '16:00',
            author: 'author',
            read: '',
          },
          {
            message: 'Инженеры собирали их буквально «на коленке», но всё сработало в вакууме.',
            time: '16:20',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: 'Вы',
    MemberName: 'Дмитрий',
    LastMessageDate: '09:15',
    LastMessage: 'Инженеры собирали их буквально «на коленке», но всё сработало в вакууме.',
    CountNoReadMessage: 5,
    messagesBlock: [
      {
        dateBlock: '17 июня',
        messages: [
          {
            message: 'Оказывается, камеры Хассельблад модифицировали вручную — без заводских чертежей!',
            time: '16:00',
            author: 'author',
            read: '',
          },
          {
            message: 'Инженеры собирали их буквально «на коленке», но всё сработало в вакууме.',
            time: '16:20',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '16 июня',
        messages: [
          {
            message: 'Каждая камера Хассельблад на Луне имела специальный тепловой экран.',
            time: '09:45',
            author: 'author',
            read: '',
          },
          {
            message: 'Без него электроника бы перегрелась под солнечными лучами.',
            time: '10:00',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  // Остальные 9 объектов по аналогии (уникальные данные, соблюдение правил)
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: '',
    MemberName: 'Екатерина',
    LastMessageDate: '11:22',
    LastMessage: 'Без него электроника бы перегрелась под солнечными лучами.',
    CountNoReadMessage: 1,
    messagesBlock: [
      {
        dateBlock: '16 июня',
        messages: [
          {
            message: 'Каждая камера Хассельблад на Луне имела специальный тепловой экран.',
            time: '09:45',
            author: 'author',
            read: '',
          },
          {
            message: 'Без него электроника бы перегрелась под солнечными лучами.',
            time: '10:00',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '15 июня',
        messages: [
          {
            message: 'Интересно, что астронавты не могли менять объективы в условиях Луны.',
            time: '15:30',
            author: 'author',
            read: '',
          },
          {
            message: 'Поэтому использовали широкоугольные линзы — чтобы захватить больше пространства.',
            time: '15:45',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: 'Вы',
    MemberName: 'Максим',
    LastMessageDate: '13:10',
    LastMessage: 'Поэтому использовали широкоугольные линзы — чтобы захватить больше пространства.',
    CountNoReadMessage: 3,
    messagesBlock: [
      {
        dateBlock: '15 июня',
        messages: [
          {
            message: 'Интересно, что астронавты не могли менять объективы в условиях Луны.',
            time: '15:30',
            author: 'author',
            read: '',
          },
          {
            message: 'Поэтому использовали широкоугольные линзы — чтобы захватить больше пространства.',
            time: '15:45',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '14 июня',
        messages: [
          {
            message: 'Некоторые снимки были сделаны с задержкой из-за особенностей плёнки.',
            time: '11:10',
            author: 'author',
            read: '',
          },
          {
            message: 'Плёнка была сверхчувствительной, но требовала точной экспозиции.',
            time: '11:25',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: '',
    MemberName: 'Виктория',
    LastMessageDate: '14:05',
    LastMessage: 'Плёнка была сверхчувствительной, но требовала точной экспозиции.',
    CountNoReadMessage: 0,
    messagesBlock: [
      {
        dateBlock: '14 июня',
        messages: [
          {
            message: 'Некоторые снимки были сделаны с задержкой из-за особенностей плёнки.',
            time: '11:10',
            author: 'author',
            read: '',
          },
          {
            message: 'Плёнка была сверхчувствительной, но требовала точной экспозиции.',
            time: '11:25',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '13 июня',
        messages: [
          {
            message: 'Камеры Хассельблад были адаптированы для работы в вакууме и при экстремальных температурах.',
            time: '07:30',
            author: 'author',
            read: '',
          },
          {
            message: 'Каждый корпус покрывали специальным светоотражающим слоем.',
            time: '07:45',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: 'Вы',
    MemberName: 'Артём',
    LastMessageDate: '08:55',
    LastMessage: 'Каждый корпус покрывали специальным светоотражающим слоем.',
    CountNoReadMessage: 4,
    messagesBlock: [
      {
        dateBlock: '13 июня',
        messages: [
          {
            message: 'Камеры Хассельблад были адаптированы для работы в вакууме и при экстремальных температурах.',
            time: '07:30',
            author: 'author',
            read: '',
          },
          {
            message: 'Каждый корпус покрывали специальным светоотражающим слоем.',
            time: '07:45',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '12 июня',
        messages: [
          {
            message: 'Для лунных камер разработали уникальную систему охлаждения.',
            time: '10:15',
            author: 'author',
            read: '',
          },
          {
            message: 'Она предотвращала перегрев электроники даже при +120°C на солнечной стороне.',
            time: '10:30',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: '',
    MemberName: 'Наталья',
    LastMessageDate: '16:40',
    LastMessage: 'Она предотвращала перегрев электроники даже при +120°C на солнечной стороне.',
    CountNoReadMessage: 1,
    messagesBlock: [
      {
        dateBlock: '12 июня',
        messages: [
          {
            message: 'Для лунных камер разработали уникальную систему охлаждения.',
            time: '10:15',
            author: 'author',
            read: '',
          },
          {
            message: 'Она предотвращала перегрев электроники даже при +120°C на солнечной стороне.',
            time: '10:30',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '11 июня',
        messages: [
          {
            message: 'Объективы для лунных камер тестировали в условиях, имитирующих вакуум.',
            time: '13:20',
            author: 'author',
            read: '',
          },
          {
            message: 'Это гарантировало чёткость снимков даже при резких перепадах температуры.',
            time: '13:35',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: 'Вы',
    MemberName: 'Иван',
    LastMessageDate: '09:20',
    LastMessage: 'Это гарантировало чёткость снимков даже при резких перепадах температуры.',
    CountNoReadMessage: 2,
    messagesBlock: [
      {
        dateBlock: '11 июня',
        messages: [
          {
            message: 'Объективы для лунных камер тестировали в условиях, имитирующих вакуум.',
            time: '13:20',
            author: 'author',
            read: '',
          },
          {
            message: 'Это гарантировало чёткость снимков даже при резких перепадах температуры.',
            time: '13:35',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '10 июня',
        messages: [
          {
            message: 'Каждая лунная камера имела резервные механизмы на случай отказа основных систем.',
            time: '16:10',
            author: 'author',
            read: '',
          },
          {
            message: 'Эти дублирующие элементы спасли несколько съёмок во время миссий.',
            time: '16:25',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },
  {
    MemberPhoto: ImgPeople,
    LastMessageWho: '',
    MemberName: 'Елена',
    LastMessageDate: '17:15',
    LastMessage: 'Эти дублирующие элементы спасли несколько съёмок во время миссий.',
    CountNoReadMessage: 0,
    messagesBlock: [
      {
        dateBlock: '10 июня',
        messages: [
          {
            message: 'Каждая лунная камера имела резервные механизмы на случай отказа основных систем.',
            time: '16:10',
            author: 'author',
            read: '',
          },
          {
            message: 'Эти дублирующие элементы спасли несколько съёмок во время миссий.',
            time: '16:25',
            author: '',
            read: Read,
          },
        ],
      },
      {
        dateBlock: '9 июня',
        messages: [
          {
            message: 'Инженеры НАСА проводили сотни тестов перед отправкой камер на Луну.',
            time: '08:45',
            author: 'author',
            read: '',
          },
          {
            message: 'Каждый тест имитировал условия лунной поверхности — от пыли до радиации.',
            time: '09:00',
            author: '',
            read: Read,
          },
        ],
      },
    ],
  },

] satisfies MemberListProps[];
