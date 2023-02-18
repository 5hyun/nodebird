import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import {
  Overlay,
  Header,
  CloseBtn,
  SlickWrapper,
  ImgWrapper,
  Indicator,
  Global,
} from "./styles";

const ImagesZoom = ({ images, onClose }) => {
  // 현재 슬라이드 저장하기 위한 state
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            // 이미지을 0번째부터
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            // 무한으로 넘겨짐
            infinite
            // 화살표가 사라져서 마우스로 밀어야 넘겨짐
            arrows={false}
            // 한번에 하나씩만 보이게
            slidesToShow={1}
            // 한번에 하나씩만 넘겨지게
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img src={`http://localhost:3065/${v.src}`} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slick>
          {/* 사진 몇 개 중에서 몇번째꺼 보고있는지 */}
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
