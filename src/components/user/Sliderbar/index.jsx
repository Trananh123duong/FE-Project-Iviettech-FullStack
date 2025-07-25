import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ImageGundam from '../../../assets/gundam.jpg';
import * as S from './styles';

const Sliderbar = () => {
  const comics = [
    { title: "Bắt Đầu Từ Cửu Đầu Điểu", chapter: 317, time: "3 ngày trước", image: ImageGundam },
    { title: "Ngạo Thị Thiên Địa", chapter: 863, time: "26 ngày trước", image: ImageGundam },
    { title: "Thiết Huyết Kiếm Sĩ", chapter: 121.1, time: "22 giờ trước", image: ImageGundam },
    { title: "Anh Hùng Giai Cấp", chapter: 120, time: "1 tháng trước", image: ImageGundam },
    { title: "Ta Có Một Sơn Trại1", chapter: 1174, time: "3 ngày trước", image: ImageGundam },
    { title: "Ta Có Một Sơn Trại2", chapter: 1174, time: "3 ngày trước", image: ImageGundam },
    { title: "Ta Có Một Sơn Trại3", chapter: 1174, time: "3 ngày trước", image: ImageGundam },
    // thêm nữa nếu muốn
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const renderStory = () => {
    return comics.map((comic, index) => (
      <S.ComicCard key={index}>
        <Link to="https://www.nettruyenup.com/truyen-tranh/nhat-kiem-doc-ton-342800">
          <img src={comic.image} alt={comic.title} />
        </Link>
        <S.StoryInfo>
          <h3>
            <Link to="https://www.nettruyenup.com/truyen-tranh/nhat-kiem-doc-ton-342800">
              {comic.title}
            </Link>
          </h3>
          <Link to="https://www.nettruyenup.com/truyen-tranh/nhat-kiem-doc-ton/chap-213/836799">
            Chapter {comic.chapter}
          </Link>
          <span><i class="fa fa-clock-o"> </i> {comic.time}</span>
        </S.StoryInfo>
      </S.ComicCard>
    ))
  }
  
  return (
    <>
      <S.PageTitle>
        Truyện đề cử <i class="fa-solid fa-angle-right"></i>
      </S.PageTitle>
      <Slider {...settings}>
        {renderStory()}
      </Slider>
    </>
  );
}

export default Sliderbar
