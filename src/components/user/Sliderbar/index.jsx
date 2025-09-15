import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { getStories } from '@redux/thunks/story.thunk'
import * as S from './styles'

const Sliderbar = () => {
  const dispatch = useDispatch()
  const { data: stories, status, error } = useSelector(
    (state) => state.story.sliderbarList
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getStories({ scope: 'sliderbar', sort: 'view_day', page: 1, limit: 10 }))
    }
  }, [status, dispatch])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  const getLatestChapter = (chapters = []) => {
    if (!chapters.length) return null
    return chapters.reduce((latest, c) =>
      new Date(latest.updatedAt) >= new Date(c.updatedAt) ? latest : c
    )
  }

  const timeAgo = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    if (months > 0) return `${months} tháng trước`
    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    if (minutes > 0) return `${minutes} phút trước`
    return `${seconds} giây trước`
  }

  return (
    <>
      <S.PageTitle>
        Truyện đề cử <i className="fa-solid fa-angle-right"></i>
      </S.PageTitle>

      {status === 'loading' && <div style={{ padding: 8 }}>Đang tải...</div>}
      {status === 'failed' && <div style={{ padding: 8, color: 'red' }}>Lỗi: {error}</div>}

      {status === 'succeeded' && (
        <Slider {...settings}>
          {stories.map((story) => {
            const latest = getLatestChapter(story.chapters)
            return (
              <S.ComicCard key={story.id}>
                <Link to={`/story/${story.id}`}>
                  <img src={story.thumbnail} alt={story.name} />
                </Link>

                <S.StoryInfo>
                  <h3>
                    <Link to={`/story/${story.id}`}>{story.name}</Link>
                  </h3>

                  {latest ? (
                    <>
                      <Link to={`/story/${story.id}/chap/${latest.chapter_number}`}>
                        Chapter {latest.chapter_number}
                      </Link>
                      <span>
                        <i className="fa fa-clock-o" /> {timeAgo(latest.updatedAt)}
                      </span>
                    </>
                  ) : (
                    <span>Chưa có chap</span>
                  )}
                </S.StoryInfo>
              </S.ComicCard>
            )
          })}
        </Slider>
      )}
    </>
  )
}

export default Sliderbar
