import { Link } from 'react-router-dom';
import ImageGundam from '../../../assets/gundam.jpg';
import * as S from './styles';

const ListStory = () => {
  const comics = [
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố ',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    },
    {
      image: ImageGundam,
      link: '#',
      title: 'Điều Còn Khó Hơn Cả Việc Giải Đố',
      views: '28K',
      comments: 35,
      likes: '5.099',
      chapters: [
        { name: 'Chapter 34', link: '#', time: '1 giờ trước' },
        { name: 'Chapter 33', link: '#', time: '5 giờ trước' },
        { name: 'Chapter 32', link: '#', time: '1 ngày trước' },
      ]
    }
  ];

  return (
    <S.UpdatedComic>
      <S.Header>
        <S.Title>
          Truyện mới cập nhật <i className="fa-solid fa-angle-right"></i>
        </S.Title>
      </S.Header>

      {comics.map((comic, index) => (
        <S.Item key={index}>
          <S.ImageWrapper>
            <Link to="https://www.nettruyenup.com/truyen-tranh/nhat-kiem-doc-ton-342800">
              <S.Image src={comic.image} alt={comic.title} />
            </Link>
            <S.View>
              <span>
                <i className="fa fa-eye" /> {comic.views}
                <i className="fa fa-comment" /> {comic.comments}
                <i className="fa fa-heart" /> {comic.likes}
              </span>
            </S.View>
          </S.ImageWrapper>

          <S.TitleH3>{comic.title}</S.TitleH3>

          <S.ChapterList>
            {comic.chapters.map((chap, idx) => (
              <S.ChapterItem key={idx}>
                <S.ChapterLink href={chap.link}>{chap.name}</S.ChapterLink>
                <S.ChapterTime>{chap.time}</S.ChapterTime>
              </S.ChapterItem>
            ))}
          </S.ChapterList>
        </S.Item>
      ))}
    </S.UpdatedComic>
  );
}

export default ListStory
