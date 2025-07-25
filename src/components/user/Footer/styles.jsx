import styled from 'styled-components';

export const Footer = styled.footer`
  color: #aaa;
  background-color: #222;
  font-size: 13px;
  padding: 15px 0;
  height: 200px;
`;

export const Container = styled.div`
  width: 1030px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
`;

export const LeftSection = styled.div`
  width: 33.3333%;
`;

export const Logo = styled.img`
  max-width: 100%;
`;

export const MarginTop = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const HalfWidth = styled.div`
  width: 50%;
`;

export const StyledLink = styled.a`
  color: #ddd;
  text-decoration: none;
`;

export const Text = styled.p`
  color: #ddd;
  margin: 10px 0 0;
`;

export const RightSection = styled.div`
  width: 66.6667%;
`;

export const KeywordBlock = styled.div``;

export const Title = styled.h4`
  margin: 5px 0;
  color: #fff;
  font-weight: 400;
  font-size: 18px;
`;

export const KeywordList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const KeywordItem = styled.li`
  display: inline-block;
  margin-right: 5px;
  line-height: 38px;
`;

export const KeywordLink = styled.a`
  border: 1px solid #ddd;
  padding: 5px;
  white-space: nowrap;
  border-radius: 4px;
  color: #fff;
  text-decoration: none;
`;
