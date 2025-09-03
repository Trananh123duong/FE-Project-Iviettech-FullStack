import styled from 'styled-components'

export const HeaderConatiner = styled.header`
  background: url(https://nettruyenvia.com/assets/images/bg_header_2017.jpg) top center repeat-x;
  width: 100%;
  height: 55px;
  -moz-transition: top .3s ease-in-out;
  -ms-transition: top .3s ease-in-out;
  -o-transition: top .3s ease-in-out;
  transition: top .3s ease-in-out;
`

export const Navbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 1030px;
  height: 100%;
  margin: auto;

  .search-box {
    display: inline-block;
    position: relative;
  }

  .search-box input {
    padding: 15px;
    width: 440px;
    border: none;
    margin: 5px 0;
    height: 5px;
  }

  .search-box input:focus {
    outline: none;
  }

  .search-box button {
    position: absolute;
    top: 5px;
    right: 0px;
    border: none;
    background-color: white;
    height: 30px;
    width: 30px;
    padding-top: 5px;
  }

  .search-box button:hover {
    cursor: pointer;
    background-color: #ebebeb;
  }
`

export const IconGroup = styled.div`
  display: inline-block;
  margin-bottom: 10px;

  .toggle-dark {
    color: #ff9601;
    float: left;
    margin-top: 12px;
    margin-left: 10px;
    font-size: 26px !important;
    cursor: pointer;
    position: relative;
  }

  .notifications {
    padding: 12px 4px 0 15px;
    position: relative;
    display: inline-block;
    cursor: pointer;
    font-size: 26px !important;
    color: white;
  }
`

export const SignGroup = styled.div`
  color: white;

  a {
    color: white;
  }
`