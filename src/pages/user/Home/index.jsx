import ListStory from '@components/user/ListStory'
import Paginate from '@components/user/Paginate'
import Sliderbar from '@components/user/Sliderbar'
import TopStory from '@components/user/TopStory'
import * as S from './styles'

const Home = () => {
  return (
    <>
      <Sliderbar />
      <S.MainContainer>
        <S.ListStory>
          <ListStory />
          <Paginate />
        </S.ListStory>
        <S.DeadlineStory>
          <TopStory />
        </S.DeadlineStory>
      </S.MainContainer>
    </>
  )
}

export default Home
