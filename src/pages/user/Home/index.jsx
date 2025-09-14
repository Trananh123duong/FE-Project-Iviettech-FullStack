import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import qs from 'qs'

import ListStory from '@components/user/ListStory'
import Paginate from '@components/user/Paginate'
import Sliderbar from '@components/user/Sliderbar'
import TopStory from '@components/user/TopStory'
import ReadingHistory from '@components/user/ReadingHistory'
import FollowedStories from '@components/user/FollowedStories'

import { STORY_LIMIT } from '@constants/paging'
import { getStories } from '@redux/thunks/story.thunk'
import * as S from './styles'

const Home = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { data: user } = useSelector((s) => s.auth.myProfile)
  const { data: stories = [], meta = {}, status, error } = useSelector(
    (s) => s.story.updatedList
  )

  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const urlPage = parseInt(query.page || 1, 10)
  const urlLimit = parseInt(query.limit || STORY_LIMIT, 10)

  useEffect(() => {
    dispatch(getStories({ scope: 'updated', page: urlPage, limit: urlLimit }))
  }, [dispatch, urlPage, urlLimit])

  const current = meta.page || urlPage
  const pageSize = meta.limit || urlLimit
  const total = meta.total || 0

  const handlePaginate = (page, size) => {
    const newQuery = qs.stringify({ ...query, page, limit: size }, { addQueryPrefix: true })
    navigate(`${location.pathname}${newQuery}`, { replace: false })
  }

  return (
    <>
      <Sliderbar />
      <S.MainContainer>
        <S.ListStory>
          <S.SectionHeader>
            <S.SectionTitle>
              Truyện mới cập nhật <i className="fa-solid fa-angle-right" />
            </S.SectionTitle>
          </S.SectionHeader>

          <ListStory stories={stories} status={status} error={error} />

          <Paginate
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginate}
          />
        </S.ListStory>

        <S.DeadlineStory>
          {user?.id && (
            <>
              <FollowedStories />
              <ReadingHistory />
            </>
          )}
          <TopStory />
        </S.DeadlineStory>
      </S.MainContainer>
    </>
  )
}

export default Home
