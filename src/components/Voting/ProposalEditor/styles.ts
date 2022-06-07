import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: #1d2125;
  border-radius: 5px;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  
  svg {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
`

export const Content = styled.div`
  padding: 3em 2em 2em 2em;
`

export const ContentRow = styled.div<{marginBottom?: string}>`
  display: flex;
  margin-bottom: ${({marginBottom}) => marginBottom ?? '2em'};
  justify-content: center;
  width: 100%;
`

export const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 1em;
  border-radius: 5px;
  background-color: #282c34;
  padding: 10px 20px;
  color: grey;
  
  &::placeholder {
    color: grey;
  }
`