import styled, { css } from "styled-components";

const StyledFormContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  z-index: 40;
  height: 100vh;
  max-width: 32rem;
  transform: none;
  overflow-y: auto;
  background-color: #ededed;
  padding: 1rem;
  transition: all 0.3s;

  ${(props) =>
    props.$expandCreate === "cabin-form" ||
    props.$expandCreate === "edit-form" ||
    props.$expandCreate === "delete-form"
      ? css`
          width: 100%;
          transform: translateX(0);
        `
      : css`
          transform: translateX(100%);
        `}
`;

export default StyledFormContainer;
