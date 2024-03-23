import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 0.9rem;
    padding: 0.3rem 0.8rem;
    font-weight: 500;
  `,
  medium: css`
    font-size: 1.125rem;
    padding: 0.6rem 1.4rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.4rem;
    padding: 1rem 2.2rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-green-600);

    &:hover {
      background-color: var(--color-green-700);
    }
  `,

  primaryBlue: css`
    color: white;
    background-color: #35682e;
    border-radius: 1rem;

    &:hover {
      background-color: #24481f;
      transition: 0.3s;
    }
  `,

  secondary: css`
    color: #00ffc3;
    background-color: #1b2f31;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;

    &:hover {
      background-color: #2b5054;
      transition: 0.3s;
    }
  `,

  danger: css`
    color: white;
    background-color: #9b4949;
    border-radius: 1rem;

    &:hover {
      background-color: #c26161;
      transition: 0.3s;
    }
  `,

  closeTab: css`
    position: absolute;
    right: 1rem;
    top: 1rem;
    border-radius: 0.5rem;
    padding: 0;
  `,
};

const StyledButton = styled.button`
  ${(props) =>
    props.$variations !== "closeTab" &&
    css`
      border: none;
      border-radius: var(--border-radius-sm);
      box-shadow: var(--shadow-sm);
    `}

  ${(props) => sizes[props.$size]}
  ${(props) => variations[props.$variations]}
`;

export default StyledButton;
