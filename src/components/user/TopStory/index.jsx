import { useState } from 'react';
import ImageGundam from '../../../assets/gundam.jpg';
import * as S from './styles';

const TopStory = () => {
  const [activeTab, setActiveTab] = useState(0);

  const comics = [
    [ // Top tháng
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong1',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong1',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      // ... thêm truyện
    ],
    [ // Top tuần
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong2',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
    ],
    [ // Top ngày
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong3',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      {
        image: ImageGundam,
        title: 'Võ Luyện Đỉnh Phong',
        url: '#',
        chapter: 'Chapter 2909',
        chapterUrl: '#',
        views: '31M',
      },
      
    ]
  ];

  const tabLabels = ['Top Tháng', 'Top Tuần', 'Top Ngày'];

  return (
    <S.BoxTab>
      <S.NavTab>
        {tabLabels.map((label, index) => (
          <li key={index} onClick={() => setActiveTab(index)}>
            <S.TabLink className={activeTab === index ? 'active' : ''}>{label}</S.TabLink>
          </li>
        ))}
      </S.NavTab>

      <S.TabPane>
        <ul>
          {comics[activeTab].map((comic, idx) => (
            <S.ComicItem key={idx}>
              <S.Rank index={idx}>{String(idx + 1).padStart(2, '0')}</S.Rank>
              <S.ComicBox>
                <S.Thumb>
                  <img src={comic.image} alt={comic.title} />
                </S.Thumb>
                <S.Title>
                  <a href={comic.url}>{comic.title}</a>
                </S.Title>
                <S.Chapter className="chapter top">
                  <a href={comic.chapterUrl}>{comic.chapter}</a>
                  <S.View>
                    <i className="fa fa-eye" /> {comic.views}
                  </S.View>
                </S.Chapter>
              </S.ComicBox>
            </S.ComicItem>
          ))}
        </ul>
      </S.TabPane>
    </S.BoxTab>
  );
}

export default TopStory
