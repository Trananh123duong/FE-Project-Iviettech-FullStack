import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { ROUTES } from '@constants/routes'
import { getStories } from '@redux/thunks/story.thunk'
import { timeAgo } from '@utils/date'
import * as S from './styles'

// Lấy chapter mới nhất theo updatedAt
const getLatestChapter = (chapters = []) => {
  if (!chapters?.length) return null
  return chapters.reduce((a, b) =>
    new Date(a?.updatedAt || 0) >= new Date(b?.updatedAt || 0) ? a : b
  )
}

// Nút điều hướng custom cho react-slick
const Arrow = ({ direction, onClick }) => (
  <S.ArrowBtn
    className={`arrow ${direction}`}
    aria-label={direction === 'prev' ? 'Trước' : 'Sau'}
    onClick={onClick}
    type="button"
  >
    {direction === 'prev' ? '‹' : '›'}
  </S.ArrowBtn>
)

const Sliderbar = () => {
  const dispatch = useDispatch()
  const { data: stories = [], status, error } = useSelector(
    (s) => s.story.sliderbarList
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getStories({ scope: 'sliderbar', sort: 'view_day', page: 1, limit: 10 }))
    }
  }, [status, dispatch])

  // Chuẩn hoá dữ liệu hiển thị
  const items = useMemo(
    () =>
      (stories || []).map((st) => {
        const latest = getLatestChapter(st.chapters)
        return {
          id: st.id,
          name: st.name,
          thumbnail: st.thumbnail,
          latestId: latest?.id,
          latestNo: latest?.chapter_number,
          latestTime: latest?.updatedAt,
        }
      }),
    [stories]
  )

  const settings = {
    dots: false,
    infinite: true,
    speed: 450,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3200,
    pauseOnHover: true,
    swipeToSlide: true,
    nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768,  settings: { slidesToShow: 2 } },
      { breakpoint: 520,  settings: { slidesToShow: 1 } },
    ],
  }

  return (
    <S.Container>
      <S.SectionHeader>
        Truyện đề cử <i className="fa-solid fa-angle-right" />
      </S.SectionHeader>

      {status === 'loading' && <S.Info>Đang tải…</S.Info>}
      {status === 'failed' && <S.Info className="error">Lỗi: {String(error)}</S.Info>}

      {status === 'succeeded' && (
        <S.SliderWrap>
          <Slider {...settings}>
            {items.map((it) => {
              const storyHref = ROUTES.USER.STORY.replace(':id', it.id)
              const chapterHref = it.latestId
                ? ROUTES.USER.CHAPTER.replace(':id', it.latestId)
                : null

              return (
                <S.Card key={it.id}>
                  <Link to={storyHref} className="thumb" aria-label={it.name}>
                    <img src={it.thumbnail} alt={it.name} loading="lazy" />
                  </Link>

                  <S.Overlay>
                    <h3 className="title">
                      <Link to={storyHref}>{it.name}</Link>
                    </h3>

                    {it.latestId ? (
                      <div className="meta">
                        <Link to={chapterHref} className="chapter">
                          Chapter {it.latestNo}
                        </Link>
                        <span className="time">
                          <i className="fa fa-clock-o" aria-hidden /> {timeAgo(it.latestTime)}
                        </span>
                      </div>
                    ) : (
                      <div className="meta">
                        <span className="chapter muted">Chưa có chap</span>
                      </div>
                    )}
                  </S.Overlay>
                </S.Card>
              )
            })}
          </Slider>
        </S.SliderWrap>
      )}
    </S.Container>
  )
}

export default Sliderbar
